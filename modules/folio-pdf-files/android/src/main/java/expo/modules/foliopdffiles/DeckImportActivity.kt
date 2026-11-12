package expo.modules.foliopdffiles

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.OpenableColumns
import java.io.File
import java.util.UUID
import java.util.concurrent.Executors

// Its lifetime, not MainActivity's, owns the source-provider grant.
class DeckImportActivity : Activity() {
  companion object {
    const val REQUEST_CODE = 9180
    private const val PICK_DOCUMENT = 9181
  }
  private val worker = Executors.newSingleThreadExecutor()
  private val handler = Handler(Looper.getMainLooper())
  private var copying = false
  private val timeout = Runnable { finishWithError("IMPORT_TIMEOUT") }

  override fun onCreate(state: Bundle?) {
    super.onCreate(state)
    if (state?.getBoolean("copying") == true) finishWithError("IMPORT_UNAVAILABLE")
    else if (state == null) {
      try {
        startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
          addCategory(Intent.CATEGORY_OPENABLE)
          // Custom .foliopack providers often report octet-stream. Content and suffix are checked below.
          type = "*/*"
          putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }, PICK_DOCUMENT)
      } catch (_: Exception) { finishWithError("IMPORT_UNAVAILABLE") }
    }
  }

  override fun onSaveInstanceState(state: Bundle) {
    state.putBoolean("copying", copying)
    super.onSaveInstanceState(state)
  }

  @Deprecated("Required by platform activity-result API")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode != PICK_DOCUMENT || copying) return
    if (resultCode != RESULT_OK) { setResult(RESULT_CANCELED); finish(); return }
    val uri = data?.data
    if (uri?.scheme != "content" || uri.authority.isNullOrBlank() || uri.authority!!.startsWith(packageName)) {
      finishWithError("IMPORT_TYPE"); return
    }
    copying = true
    handler.postDelayed(timeout, 30000)
    worker.execute { copyDocument(uri) }
  }

  private fun copyDocument(uri: Uri) {
    var copied: File? = null
    try {
      var name = ""
      contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE), null, null, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
          val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
          if (nameIndex >= 0 && !cursor.isNull(nameIndex)) name = cursor.getString(nameIndex)
          val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
          if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) require(cursor.getLong(sizeIndex) <= DeckImportPolicy.MAX_BYTES) { "IMPORT_TOO_LARGE" }
        }
      }
      DeckImportPolicy.validateName(name)
      val root = File(cacheDir, "folio-deck-import").apply { mkdirs() }
      val file = File(root, "deck-${UUID.randomUUID()}.tmp")
      copied = file
      contentResolver.openInputStream(uri)?.use { input ->
        file.outputStream().use { output -> DeckImportPolicy.copyBounded(input, output) }
      } ?: throw IllegalStateException("IMPORT_UNAVAILABLE")
      runOnUiThread {
        if (isFinishing || isDestroyed) file.delete()
        else {
          // Do not forward the source URI, ClipData, or any grant flags.
          setResult(RESULT_OK, Intent().putExtra("fileName", file.name).putExtra("name", name))
          finish()
        }
      }
    } catch (error: Exception) {
      copied?.delete()
      val code = error.message?.takeIf { it.startsWith("IMPORT_") } ?: "IMPORT_UNAVAILABLE"
      runOnUiThread { if (!isFinishing && !isDestroyed) finishWithError(code) }
    }
  }
  private fun finishWithError(code: String) {
    setResult(RESULT_FIRST_USER, Intent().putExtra("error", code)); finish()
  }
  override fun onDestroy() {
    handler.removeCallbacks(timeout)
    worker.shutdownNow()
    super.onDestroy()
  }
}
