'use strict';

// query-string 7 expects a callable CommonJS export; the patched decoder is ESM.
// Keep the upstream implementation and its audit trail, rather than vendoring it.
module.exports = require('@folio/uri-decoder-upstream').default;
