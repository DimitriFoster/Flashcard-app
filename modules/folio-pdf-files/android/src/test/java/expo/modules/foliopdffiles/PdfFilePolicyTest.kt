package expo.modules.foliopdffiles

import org.junit.Assert.*
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.OutputStream

class PdfFilePolicyTest {
  @Test fun acceptsOnlyAppOwnedBasenames() {
    val root = File(System.getProperty("java.io.tmpdir"), "folio-policy-test")
    assertEquals(File(root, "pdf-abc-123.pdf").canonicalFile, PdfFilePolicy.resolve(root, "pdf-abc-123.pdf"))
    for (name in listOf("../notes", "pdf-../notes.pdf", "pdf-a/b.pdf", "pdf-a\\b.pdf", "pdf-%2e%2e.pdf", "https://host/file.pdf", "pdf-a.pdf/..", "pdf-a.pdf\n")) {
      assertThrows(IllegalArgumentException::class.java) { PdfFilePolicy.resolve(root, name) }
    }
  }

  @Test fun copiesBytesWithoutRenderingOrChangingTheDocument() {
    val bytes = "%PDF-1.7\nA small fixture".toByteArray()
    val output = ByteArrayOutputStream()
    assertEquals(bytes.size.toLong(), PdfFilePolicy.copyBounded(ByteArrayInputStream(bytes), output))
    assertArrayEquals(bytes, output.toByteArray())
  }

  @Test fun rejectsEmptyShortAndNonPdfFiles() {
    for (value in listOf("", "%PDF", "<html>not a PDF", "prefix%PDF-1.7")) {
      assertThrows(IllegalArgumentException::class.java) {
        PdfFilePolicy.copyBounded(ByteArrayInputStream(value.toByteArray()), ByteArrayOutputStream())
      }
    }
  }

  @Test fun cancelledCopyStopsReading() {
    try {
      Thread.currentThread().interrupt()
      assertThrows(InterruptedException::class.java) {
        PdfFilePolicy.copyBounded(ByteArrayInputStream("%PDF-1.7".toByteArray()), ByteArrayOutputStream())
      }
    } finally {
      Thread.interrupted()
    }
  }

  @Test fun enforcesLimitOnActualBytesNotPickerMetadata() {
    val bytes = ByteArray((PdfFilePolicy.MAX_BYTES + 1).toInt())
    "%PDF-".toByteArray().copyInto(bytes)
    var written = 0L
    val sink = object : OutputStream() {
      override fun write(value: Int) { written++ }
      override fun write(buffer: ByteArray, offset: Int, length: Int) { written += length }
    }
    val failure = assertThrows(IllegalArgumentException::class.java) {
      PdfFilePolicy.copyBounded(ByteArrayInputStream(bytes), sink)
    }
    assertEquals("PDF_TOO_LARGE", failure.message)
    assertTrue(written <= PdfFilePolicy.MAX_BYTES)
    written = 0
    assertEquals(PdfFilePolicy.MAX_BYTES, PdfFilePolicy.copyBounded(ByteArrayInputStream(bytes, 0, PdfFilePolicy.MAX_BYTES.toInt()), sink))
  }
}
