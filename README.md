# @tandil/diffparse
[![License](https://img.shields.io/npm/l/@tandil/diffparse?color=%23007ec6)](https://github.com/danielduarte/diffparse/blob/master/LICENSE)
[![NPM Package Version](https://img.shields.io/npm/v/@tandil/diffparse)](https://www.npmjs.com/package/@tandil/diffparse)

Simple parser for Diff files (unified diff format)

## Features
- Parse a diff file from its filepath
- Parse a diff directly from a string

## Usage

### Parse from file

Given a filepath it returns a `Prmoise` that resolves to a JS object with the diff content parsed and easily accessible programmatically.

```js
const parser = require('@tandil/diffparse');

parser.parseDiffFile('./examples/example1.diff').then(diff => {
  console.log(diff);
});
```

### Parse from string

Given a diff string it returns a JS object with the diff content parsed and easily accessible programmatically.

```js
const parser = require('@tandil/diffparse');

const diffStr = `diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..2ccbe46
--- /dev/null
+++ b/.gitignore
@@ -0,0 +1 @@
+/node_modules/`;

const diff = parser.parseDiffString(diffStr);

console.log(diff);
```

Outputs

```
{
  header: [],
  files: [
    {
      header: 'diff --git a/.gitignore b/.gitignore',
      mode: undefined,
      index: 'index 0000000..2ccbe46',
      old: '--- /dev/null',
      new: '+++ b/.gitignore',
      chunks: []
    }
  ]
}
```
