Pod::Spec.new do |s|
  s.name = 'FolioPdfFiles'
  s.version = '1.0.0'
  s.summary = 'Folio scoped file imports'
  s.description = 'App-local, bounded imports using temporary document access.'
  s.author = 'Folio'
  s.homepage = 'https://expo.dev'
  s.license = { :type => 'MIT' }
  s.source = { :git => '' }
  s.platform = :ios, '15.1'
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
end
