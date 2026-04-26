#!/usr/bin/env node
/* eslint-disable */
// Convert src/data/*.ts mock data files to *.json + a thin re-export shim.
// Strategy: strip TS imports/types, replace `export const NAME ... = LITERAL;`
// with `module.exports.NAME = LITERAL;`, and eval. Then dump each named export
// as JSON.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const FILES = [
  'products.ts',
  'reviews.ts',
  'orders.ts',
  'categories.ts',
  'brands.ts',
  'banners.ts',
  'notifications.ts',
  'paymentMethods.ts',
  'addresses.ts',
  'aiResponses.ts',
  'searchSeeds.ts',
];

function transformSource(src) {
  src = src.replace(/^import .*?;\n/gm, '');
  src = src.replace(/export const (\w+)\s*:\s*[^=]+=/g, 'module.exports.$1 =');
  src = src.replace(/export const (\w+)\s*=/g, 'module.exports.$1 =');
  // Strip type annotations on local `const NAME: TYPE = ...`
  src = src.replace(/(\bconst\s+\w+)\s*:\s*[^=]+=/g, '$1 =');
  // Strip type annotations on arrow fn params + return type:
  //   `(a: T, b: U): R =>`  ->  `(a, b) =>`
  //   `(a: T, b: U) =>`     ->  `(a, b) =>`
  src = src.replace(/\(([^)]*)\)(\s*:\s*[^=]+)?=>/g, (_m, params) => {
    const stripped = params
      .split(',')
      .map((p) => p.replace(/:\s*[^,]+$/, '').trim())
      .filter(Boolean)
      .join(', ');
    return `(${stripped}) =>`;
  });
  return src;
}

for (const file of FILES) {
  const tsPath = path.join(DATA_DIR, file);
  if (!fs.existsSync(tsPath)) {
    console.warn('skip (missing):', file);
    continue;
  }
  const raw = fs.readFileSync(tsPath, 'utf8');
  const transformed = transformSource(raw);

  const sandbox = { module: { exports: {} } };
  sandbox.exports = sandbox.module.exports;
  try {
    vm.runInNewContext(transformed, sandbox, { filename: file });
  } catch (err) {
    console.error('FAIL', file, '->', err.message);
    process.exitCode = 1;
    continue;
  }

  const exported = sandbox.module.exports;
  const baseName = file.replace(/\.ts$/, '');
  const jsonPath = path.join(DATA_DIR, `${baseName}.data.json`);

  // Only persist plain-data exports (arrays/objects/strings/numbers/bool).
  const dataExports = {};
  for (const [k, v] of Object.entries(exported)) {
    if (typeof v !== 'function') {
      dataExports[k] = v;
    }
  }
  fs.writeFileSync(jsonPath, JSON.stringify(dataExports, null, 2));
  console.log('ok', file, '->', path.basename(jsonPath));
}
