package expo.modules.foliopdffiles

import java.io.File
import java.io.InputStream
import java.io.OutputStream

internal object PdfFilePolicy {
  const val MAX_BYTES = 25L * 1024 * 1024
  private val fileNamePattern = Regex("^pdf-[a-z0-9-]{1,80}\\.pdf$")

  fun resolve(root: File, name: String): File {
    require(fileNamePattern.matches(name)) { "Invalid PDF filename" }
    val target = File(root, name).canonicalFile
    require(target.parentFile == root.canonicalFile) { "Invalid PDF location" }
    return target
  }

  // This signature check rejects obvious non-PDFs; it is NOT a malware scan.
  fun copyBounded(input: InputStream, output: OutputStream): Long {
    val header = ByteArray(5)
    for (i in header.indices) {
      val byte = input.read()
      require(byte >= 0) { "PDF_INVALID" }
      header[i] = byte.toByte()
    }
    require(header.contentEquals("%PDF-".toByteArray(Charsets.US_ASCII))) { "PDF_INVALID" }
    output.write(header)
    val buffer = ByteArray(16 * 1024)
    var total = header.size.toLong()
    while (true) {
      if (Thread.currentThread().isInterrupted) throw InterruptedException("PDF import cancelled")
      val count = input.read(buffer)
      if (count < 0) break
      if (count == 0) continue
      total += count
      require(total <= MAX_BYTES) { "PDF_TOO_LARGE" }
      output.write(buffer, 0, count)
    }
    return total
  }
}
