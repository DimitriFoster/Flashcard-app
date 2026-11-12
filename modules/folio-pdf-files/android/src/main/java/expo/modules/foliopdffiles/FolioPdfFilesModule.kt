package expo.modules.foliopdffiles

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Intent
import androidx.core.content.FileProvider
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class FolioPdfFilesModule : Module() {
  private val context get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
  private val authority get() = "${context.packageName}.folio.pdf"
  private val storageRoot get() = File(context.noBackupFilesDir, "folio-pdfs").apply { mkdirs() }
  private val shareRoot get() = File(context.cacheDir, "folio-pdf-share").apply { mkdirs() }
  private var pickerPromise: Promise? = null
  @Volatile private var deckPickerPromise: Promise? = null

  override fun definition() = ModuleDefinition {
    Name("FolioPdfFiles")

    AsyncFunction("pickDeckAsync") { promise: Promise ->
      if (deckPickerPromise != null || pickerPromise != null) fail("IMPORT_BUSY")
      val root = File(context.cacheDir, "folio-deck-import").apply { mkdirs() }
      // Only this private directory is used for transient deck files.
      root.listFiles()?.filter { it.isFile && it.name.matches(Regex("deck-[a-f0-9-]+\\.tmp")) }?.forEach { it.delete() }
      deckPickerPromise = promise
      try {
        appContext.throwingActivity.startActivityForResult(Intent(context, DeckImportActivity::class.java), DeckImportActivity.REQUEST_CODE)
      } catch (_: Exception) {
        deckPickerPromise = null
        promise.reject("IMPORT_UNAVAILABLE", "Deck picker unavailable", null)
      }
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("pickPdfAsync") { promise: Promise ->
      if (pickerPromise != null || deckPickerPromise != null) fail("PDF_BUSY")
      pickerPromise = promise
      try {
        appContext.throwingActivity.startActivityForResult(
          Intent(context, PdfImportActivity::class.java), PdfImportActivity.REQUEST_CODE
        )
      } catch (_: Exception) {
        pickerPromise = null
        promise.reject("PDF_UNAVAILABLE", "PDF picker unavailable", null)
      }
    }.runOnQueue(Queues.MAIN)

    OnActivityResult { _, (requestCode, resultCode, data) ->
      if (requestCode == DeckImportActivity.REQUEST_CODE) {
        val promise = deckPickerPromise
        val name = data?.getStringExtra("name") ?: ""
        val fileName = data?.getStringExtra("fileName") ?: ""
        val root = File(context.cacheDir, "folio-deck-import")
        if (resultCode != Activity.RESULT_OK) {
          deckPickerPromise = null
          if (resultCode == Activity.RESULT_CANCELED) promise?.resolve(null)
          else promise?.reject(data?.getStringExtra("error") ?: "IMPORT_UNAVAILABLE", "Deck import failed", null)
        } else {
          Thread {
            var file: File? = null
            try {
              require(fileName.matches(Regex("deck-[a-f0-9-]+\\.tmp")))
              file = File(root, fileName)
              require(file.isFile && file.length() in 1..DeckImportPolicy.MAX_BYTES)
              DeckImportPolicy.validateName(name)
              val text = DeckImportPolicy.decode(file.readBytes())
              if (!file.delete()) throw IllegalStateException("IMPORT_CLEANUP")
              if (deckPickerPromise === promise) promise?.resolve(mapOf("name" to name, "text" to text))
            } catch (_: Exception) {
              file?.delete()
              if (deckPickerPromise === promise) promise?.reject("IMPORT_INVALID", "Choose a valid UTF-8 text file", null)
            } finally { deckPickerPromise = null }
          }.start()
        }
      }
      if (requestCode == PdfImportActivity.REQUEST_CODE) {
        val promise = pickerPromise
        pickerPromise = null
        when (resultCode) {
          Activity.RESULT_CANCELED -> promise?.resolve(null)
          Activity.RESULT_OK -> promise?.resolve(mapOf(
            "fileName" to data?.getStringExtra("fileName"),
            "size" to data?.getLongExtra("size", 0),
            "originalName" to data?.getStringExtra("originalName")
          ))
          else -> promise?.reject(data?.getStringExtra("error") ?: "PDF_UNAVAILABLE", "PDF import failed", null)
        }
      }
    }

    OnDestroy {
      deckPickerPromise?.reject("IMPORT_UNAVAILABLE", "Deck picker interrupted", null)
      deckPickerPromise = null
      pickerPromise?.reject("PDF_UNAVAILABLE", "PDF picker interrupted", null)
      pickerPromise = null
    }

    AsyncFunction("openPdfAsync") Coroutine { name: String, displayName: String, choose: Boolean ->
      val uri = withContext(Dispatchers.IO) {
        val source = PdfFilePolicy.resolve(storageRoot, name)
        if (!source.isFile || source.length() !in 1..PdfFilePolicy.MAX_BYTES) fail("PDF_MISSING")
        cleanExpiredShares()
        val shared = PdfFilePolicy.resolve(shareRoot, name)
        context.revokeUriPermission(FileProvider.getUriForFile(context, authority, shared), Intent.FLAG_GRANT_READ_URI_PERMISSION)
        try {
          source.inputStream().use { input ->
            shared.outputStream().use { output -> PdfFilePolicy.copyBounded(input, output) }
          }
        } catch (_: Exception) {
          shared.delete()
          fail("PDF_UNAVAILABLE")
        }
        val safeLabel = displayName.replace(Regex("[\\p{Cntrl}\\p{Cf}/\\\\]"), "").take(180)
        FileProvider.getUriForFile(context, authority, shared, safeLabel)
      }
      withContext(Dispatchers.Main) {
        val activity = appContext.currentActivity ?: fail("PDF_UNAVAILABLE")
        val view = Intent(Intent.ACTION_VIEW).apply {
          setDataAndType(uri, "application/pdf")
          clipData = ClipData.newRawUri("PDF attachment", uri)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        if (view.resolveActivity(context.packageManager) == null) {
          "no_reader"
        } else {
          try {
            activity.startActivity(if (choose) Intent.createChooser(view, "Open PDF with") else view)
            "opened"
          } catch (_: ActivityNotFoundException) {
            "no_reader"
          } catch (_: SecurityException) {
            fail("PDF_UNAVAILABLE")
          }
        }
      }
    }

    AsyncFunction("deletePdfAsync") { name: String ->
      val stored = PdfFilePolicy.resolve(storageRoot, name)
      val shared = PdfFilePolicy.resolve(shareRoot, name)
      context.revokeUriPermission(FileProvider.getUriForFile(context, authority, shared), Intent.FLAG_GRANT_READ_URI_PERMISSION)
      if (shared.exists() && !shared.delete()) fail("PDF_DELETE_FAILED")
      if (stored.exists() && !stored.delete()) fail("PDF_DELETE_FAILED")
    }
  }

  private fun cleanExpiredShares() {
    val cutoff = System.currentTimeMillis() - 24 * 60 * 60 * 1000L
    shareRoot.listFiles()?.filter { it.isFile && it.lastModified() < cutoff }?.forEach {
      context.revokeUriPermission(FileProvider.getUriForFile(context, authority, it), Intent.FLAG_GRANT_READ_URI_PERMISSION)
      it.delete()
    }
  }

  private fun fail(code: String): Nothing = throw CodedException(code, "PDF file operation failed", null)
}
