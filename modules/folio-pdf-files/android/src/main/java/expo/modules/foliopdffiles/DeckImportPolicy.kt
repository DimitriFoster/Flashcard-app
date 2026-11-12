package expo.modules.foliopdffiles

import java.io.InputStream
import java.io.OutputStream
import java.nio.ByteBuffer
import java.nio.charset.CodingErrorAction

internal object DeckImportPolicy {
  const val MAX_BYTES = 1024 * 1024L
  fun validateName(name: String) {
    require(name.length in 1..200 && !name.any { it.code < 32 || it == '/' || it == '\\' || it.code == 127 }) { "IMPORT_TYPE" }
    require(name.substringAfterLast('.', "").lowercase() in setOf("csv", "tsv", "txt", "json", "foliopack")) { "IMPORT_TYPE" }
  }

  fun copyBounded(input: InputStream, output: OutputStream): Long {
    val buffer = ByteArray(8192)
    var total = 0L
    while (true) {
      if (Thread.currentThread().isInterrupted) throw InterruptedException("IMPORT_CANCELLED")
      val count = input.read(buffer)
      if (count < 0) break
      total += count
      require(total <= MAX_BYTES) { "IMPORT_TOO_LARGE" }
      output.write(buffer, 0, count)
    }
    require(total > 0) { "IMPORT_EMPTY" }
    return total
  }

  fun decode(bytes: ByteArray): String {
    require(bytes.size.toLong() in 1..MAX_BYTES) { "IMPORT_TOO_LARGE" }
    val text = Charsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
      .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString()
    require(text.none { it.code < 32 && it !in "\t\r\n" }) { "IMPORT_BINARY" }
    return text
  }
}
