package expo.modules.foliopdffiles

import android.net.Uri
import android.os.ParcelFileDescriptor
import androidx.core.content.FileProvider
import java.io.FileNotFoundException

class PdfShareProvider : FileProvider() {
  override fun openFile(uri: Uri, mode: String): ParcelFileDescriptor {
    if (mode != "r") throw FileNotFoundException("PDF attachments are read-only")
    return super.openFile(uri, mode) ?: throw FileNotFoundException("PDF attachment is unavailable")
  }

  override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int =
    throw SecurityException("PDF attachments are read-only")
}
