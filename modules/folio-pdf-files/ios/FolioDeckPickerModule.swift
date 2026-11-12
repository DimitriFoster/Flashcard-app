import ExpoModulesCore
import UIKit
import UniformTypeIdentifiers

public class FolioDeckPickerModule: Module {
  private var picker: DeckPickerDelegate?
  public func definition() -> ModuleDefinition {
    Name("FolioPdfFiles")
    AsyncFunction("pickDeckAsync") { (promise: Promise) in
      guard self.picker == nil else { promise.reject("IMPORT_BUSY", "Picker already open"); return }
      guard let host = self.appContext?.utilities?.currentViewController() else {
        promise.reject("IMPORT_UNAVAILABLE", "Picker unavailable"); return
      }
      let delegate = DeckPickerDelegate(promise: promise) { self.picker = nil }
      self.picker = delegate
      let controller = UIDocumentPickerViewController(forOpeningContentTypes: [.content], asCopy: false)
      controller.allowsMultipleSelection = false
      controller.delegate = delegate
      controller.presentationController?.delegate = delegate
      host.present(controller, animated: true)
    }.runOnQueue(.main)
  }
}

private final class DeckPickerDelegate: NSObject, UIDocumentPickerDelegate, UIAdaptivePresentationControllerDelegate {
  private let promise: Promise
  private let finished: () -> Void
  private var reading = false
  private var settled = false
  init(promise: Promise, finished: @escaping () -> Void) { self.promise = promise; self.finished = finished }
  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) { cancel() }
  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) { if !reading { cancel() } }
  private func cancel() {
    guard !reading, !settled else { return }
    settled = true
    promise.resolve(nil as String?)
    finished()
  }
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    guard !reading, !settled, let url = urls.first else { cancel(); return }
    reading = true
    DispatchQueue.global(qos: .userInitiated).async {
      do {
        let result = try Self.readFile(url)
        DispatchQueue.main.async {
          self.settled = true
          self.promise.resolve(result)
          self.finished()
        }
      } catch {
        let code: String
        if case ImportFailure.code(let value) = error { code = value } else { code = "IMPORT_UNAVAILABLE" }
        DispatchQueue.main.async {
          self.settled = true
          self.promise.reject(code, "Could not import file safely")
          self.finished()
        }
      }
    }
  }

  private static func readFile(_ url: URL) throws -> [String: String] {
    let accessing = url.startAccessingSecurityScopedResource()
    defer { if accessing { url.stopAccessingSecurityScopedResource() } }
    let name = url.lastPathComponent
    guard name.count <= 200, ["csv", "tsv", "txt", "json", "foliopack"].contains(url.pathExtension.lowercased()) else {
      throw ImportFailure.code("IMPORT_TYPE")
    }
    let info = try url.resourceValues(forKeys: [.fileSizeKey, .isDirectoryKey])
    guard info.isDirectory != true, (info.fileSize ?? 0) <= 1048576 else { throw ImportFailure.code("IMPORT_TOO_LARGE") }
    guard let stream = InputStream(url: url) else { throw ImportFailure.code("IMPORT_UNAVAILABLE") }
    stream.open()
    defer { stream.close() }
    var data = Data()
    var bytes = [UInt8](repeating: 0, count: 8192)
    while true {
      let count = stream.read(&bytes, maxLength: bytes.count)
      if count < 0 { throw ImportFailure.code("IMPORT_INVALID") }
      if count == 0 { break }
      guard data.count + count <= 1048576 else { throw ImportFailure.code("IMPORT_TOO_LARGE") }
      data.append(contentsOf: bytes.prefix(count))
    }
    guard !data.isEmpty, let text = String(data: data, encoding: .utf8) else { throw ImportFailure.code("IMPORT_INVALID") }
    // Both stream and document scope close before the result reaches JavaScript.
    return ["name": name, "text": text]
  }
}
private enum ImportFailure: Error { case code(String) }
