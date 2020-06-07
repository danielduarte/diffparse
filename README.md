# @tandil/diffparse
[![NPM Package Version](https://img.shields.io/npm/v/@tandil/diffparse)](https://www.npmjs.com/package/@tandil/diffparse)
[![License](https://img.shields.io/npm/l/@tandil/diffparse?color=%23007ec6)](https://github.com/danielduarte/diffparse/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)

Simple parser for Diff files (unified diff format)

## Features

- Parse a diff file from its filepath
- Parse a diff directly from a string
- Error reporting: If there are parsing errors, the partial result is returned and the list of detected errors including line numbers

## Usage

### Parse from file

#### Async with Promises

Given a filepath it returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a JS object with the diff content parsed and easily accessible programmatically.

```js
const parser = require('@tandil/diffparse');

parser.parseDiffFile('./examples/example1.diff').then(diff => {
  console.log(diff);
});
```

#### Sync

```js
const parser = require('@tandil/diffparse');

const diff = parser.parseDiffFileSync('./examples/example1.diff');
console.log(diff);
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

```js
{
  header: [],
  files: [
    {
      header: 'diff --git a/.gitignore b/.gitignore',
      mode: 'new file mode 100644',
      index: 'index 0000000..2ccbe46',
      old: '--- /dev/null',
      new: '+++ b/.gitignore',
      chunks: [
        {
          header: '@@ -0,0 +1 @@',
          content: [
            '+/node_modules/'
          ]
        }
      ]
    }
  ],
  errors: []
}
```

## Having issues?

Feel free to report any issues or feature request in [Github repo](https://github.com/danielduarte/diffparse/issues/new).
