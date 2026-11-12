package expo.modules.foliopdffiles

import org.junit.Assert.*
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

class DeckImportPolicyTest {
  @Test fun boundedCopyMatchesContent() {
    val bytes = "front,back\nQuestion,Answer".toByteArray()
    val output = ByteArrayOutputStream()
    assertEquals(bytes.size.toLong(), DeckImportPolicy.copyBounded(ByteArrayInputStream(bytes), output))
    assertArrayEquals(bytes, output.toByteArray())
  }
  @Test fun oversizedStreamIsRejectedWithoutTrustingMetadata() {
    assertThrows(IllegalArgumentException::class.java) { DeckImportPolicy.copyBounded(ByteArrayInputStream(ByteArray(1048577)), ByteArrayOutputStream()) }
  }
  @Test fun emptyStreamsAreRejected() {
    assertThrows(IllegalArgumentException::class.java) { DeckImportPolicy.copyBounded(ByteArrayInputStream(byteArrayOf()), ByteArrayOutputStream()) }
  }
  @Test fun strictUtf8AndBinaryRejection() {
    assertEquals("Q,A", DeckImportPolicy.decode("Q,A".toByteArray()))
    assertThrows(Exception::class.java) { DeckImportPolicy.decode(byteArrayOf(0xc3.toByte(), 0x28)) }
    assertThrows(Exception::class.java) { DeckImportPolicy.decode(byteArrayOf(0, 1)) }
  }
  @Test fun namesCannotEscapeOrSelectBinaryFiles() {
    DeckImportPolicy.validateName("Study.FOLIOPACK")
    listOf("../secret.csv", "file.pdf", "file.xlsx", "file.csv.exe").forEach { name ->
      assertThrows(IllegalArgumentException::class.java) { DeckImportPolicy.validateName(name) }
    }
  }
}
