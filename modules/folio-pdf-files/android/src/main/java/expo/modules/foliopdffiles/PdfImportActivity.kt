package expo.modules.foliopdffiles

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import java.io.File
import java.util.UUID
import java.util.concurrent.Executors

// Picker grants belong to this short-lived activity, never Folio's main activity.
class PdfImportActivity : Activity() {
  companion object {
    const val REQUEST_CODE = 9178
    private const val PICK_DOCUMENT = 9179
  }

  private val worker = Executors.newSingleThreadExecutor()
  private var copying = false

  override fun onCreate(state: Bundle?) {
    super.onCreate(state)
    if (state?.getBoolean("copying") == true) {
      finishWithError("PDF_UNAVAILABLE")
    } else if (state == null) {
      try {
        startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
          addCategory(Intent.CATEGORY_OPENABLE)
          type = "application/pdf"
          putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }, PICK_DOCUMENT)
      } catch (_: Exception) {
        finishWithError("PDF_UNAVAILABLE")
      }
    }
  }

  override fun onSaveInstanceState(state: Bundle) {
    state.putBoolean("copying", copying)
    super.onSaveInstanceState(state)
  }

  @Deprecated("Required by the platform activity-result API")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode != PICK_DOCUMENT || copying) return
    if (resultCode != RESULT_OK) {
      setResult(RESULT_CANCELED)
      finish()
      return
    }
    val uri = data?.data
    if (uri?.scheme != "content" || uri.authority.isNullOrBlank() ||
      uri.authority!!.startsWith(packageName)) {
      finishWithError("PDF_INVALID")
      return
    }
    copying = true
    worker.execute { copyDocument(uri) }
  }

  private fun copyDocument(uri: Uri) {
    var copied: File? = null
    try {
      val originalName = readNameAndCheckSize(uri)
      val root = File(noBackupFilesDir, "folio-pdfs").apply { mkdirs() }
      val file = PdfFilePolicy.resolve(root, "pdf-${UUID.randomUUID()}.pdf")
      copied = file
      val size = contentResolver.openInputStream(uri)?.use { input ->
        file.outputStream().use { output -> PdfFilePolicy.copyBounded(input, output) }
      } ?: throw IllegalStateException("PDF_UNAVAILABLE")
      runOnUiThread {
        if (isFinishing || isDestroyed) {
          file.delete()
        } else {
          // A fresh result intent intentionally excludes the source URI, ClipData,
          // and grant flags. Finishing releases all activity-owned picker grants.
          setResult(RESULT_OK, Intent().apply {
            putExtra("fileName", file.name)
            putExtra("size", size)
            putExtra("originalName", originalName)
          })
          finish()
        }
      }
    } catch (error: Exception) {
      val cleanupFailed = copied?.let { it.exists() && !it.delete() } == true
      val code = if (cleanupFailed) "PDF_DELETE_FAILED" else when (error.message) {
        "PDF_INVALID", "PDF_TOO_LARGE" -> error.message!!
        else -> "PDF_UNAVAILABLE"
      }
      runOnUiThread { if (!isFinishing && !isDestroyed) finishWithError(code) }
    }
  }

  private fun readNameAndCheckSize(uri: Uri): String {
    var name = "Document.pdf"
    contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE), null, null, null)?.use { cursor ->
      if (cursor.moveToFirst()) {
        val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
        if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) {
          val size = cursor.getLong(sizeIndex)
          require(size <= PdfFilePolicy.MAX_BYTES) { "PDF_TOO_LARGE" }
          require(size > 0) { "PDF_INVALID" }
        }
        val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
        if (nameIndex >= 0 && !cursor.isNull(nameIndex)) name = cursor.getString(nameIndex).take(180)
      }
    }
    return name
  }

  private fun finishWithError(code: String) {
    setResult(RESULT_FIRST_USER, Intent().putExtra("error", code))
    finish()
  }

  override fun onDestroy() {
    worker.shutdownNow()
    super.onDestroy()
  }
}
