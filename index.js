#!/usr/bin/env node
/*!
 * Copyright (c) 2020 Daniel Duarte <danieldd.ar@gmail.com>
 * Licensed under MIT License. See LICENSE file for details.
 */

const fs = require('fs');
const path = require('path');


class Token {
  constructor(type, content, ln) {
    this.type = type;
    this.content = content;
    this.ln = ln;
  }
}

class TokenStream {
  constructor(input) {
    this.lines = input.split('\n');
    this.cur = 0;
    this.detectors = Object.entries({
      DIFF: /^diff --git a\/(.*) b\/(.*)$/,
      OLD_FILE: /^--- (.*)$/,
      NEW_FILE: /^\+\+\+ (.*)$/,
      NEW_MODE: /^new file mode \d{6}$/,
      INDEX: /^index [0-9a-f]+\.\.[0-9a-f]+( \d+)?$/,
      CHUNK: /^@@ -\d+(,\d+)?( \+\d+(,\d+)?)? @@/,
    });
  }

  get() {
    if (this.finished()) {
      return null;
    }
    if (this.cur === this.lines.length) {
      return new Token('EOF', '\0', this.cur + 1);
    }
    const line = this.lines[this.cur];
    for (const [type, detector] of this.detectors) {
      if (detector.test(line)) {
        return new Token(type, line, this.cur + 1);
      }
    }
    return new Token('ANY', line, this.cur + 1);
  }

  next() {
    const t = this.get();
    t !== null && this.cur++;
    return t;
  }

  finished() {
    return this.cur > this.lines.length;
  }
}

class UdiffParser {
  constructor(stream) {
    this.stream = stream;
    this.errors = [];
  }

  parse() {
    this.errors = [];
    return this.rule_diff();
  }

  error(msg) {
    this.errors.push(msg);
  }

  expect(token, types) {
    if (typeof types === 'string') {
      types = [types];
    }

    if (!types.includes(token.type)) {
      this.error(`[${token.ln}] Expected one of [${types.join(', ')}] but found ${token.type}: '${token.content}'`);
    }
  }

  getErrors() {
    return this.errors;
  }

  rule_diff() {
    let header = [];
    if (this.stream.get().type === 'ANY') {
      header = this.rule_header();
    }

    let files = [];
    if (['DIFF', 'NEW_MODE', 'INDEX', 'OLD_FILE'].includes(this.stream.get().type)) {
      files = this.rule_files();
    }

    const eof = this.stream.next();
    this.expect(eof, 'EOF');

    return { header, files, errors: this.getErrors() }
  }

  rule_header() {
    let header = [];
    while (this.stream.get().type === 'ANY') {
      const t = this.stream.next();
      header.push(t.content);
    }

    return header;
  }

  rule_files() {
    const files = [];
    while (['DIFF', 'NEW_MODE', 'INDEX', 'OLD_FILE'].includes(this.stream.get().type)) {
      const file = this.rule_file();
      files.push(file);
    }

    return files;
  }

  rule_file() {
    // diff line
    let header = null;
    if (this.stream.get().type === 'DIFF') {
      header = this.stream.next();
    }

    // mode line (optional)
    let mode = null;
    if (this.stream.get().type === 'NEW_MODE') {
      mode = this.stream.next();
    }

    // index line
    let index = null;
    if (this.stream.get().type === 'INDEX') {
      index = this.stream.next();
    }

    // old file line
    const oldFile = this.stream.next();
    this.expect(oldFile, 'OLD_FILE');

    // new file line
    const newFile = this.stream.next();
    this.expect(newFile, 'NEW_FILE');

    // chunks
    let chunks = [];
    const t = this.stream.get();
    switch (t.type) {
      case 'CHUNK':
        chunks = this.rule_chunks();
        break;
      case 'DIFF':
      case 'EOF':
        break;
      default:
        this.expect(t, ['CHUNK', 'DIFF', 'EOF']);
    }

    return {
      header: header !==null ? header.content : null,
      mode: mode !==null ? mode.content : null,
      index: index !==null ? index.content : null,
      old: oldFile.content,
      new: newFile.content,
      chunks
    };
  }

  rule_chunks() {
    const chunks = [];
    while (this.stream.get().type === 'CHUNK') {
      const chunk = this.rule_chunk();
      chunks.push(chunk);
    }

    return chunks;
  }

  rule_chunk() {
    const header = this.stream.next();
    this.expect(header, 'CHUNK');

    const content = [];
    while (this.stream.get().type === 'ANY') {
      const line = this.stream.next().content;
      content.push(line);
    }

    return {header: header.content, content};
  }
}

const parseDiffString = input => {
  const tokenStream = new TokenStream(input);
  const parser = new UdiffParser(tokenStream);

  return parser.parse();
};

const parseDiffFile = filepath => new Promise((resolve, reject) => {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) { reject(err); }
    resolve(parseDiffString(data));
  });
});


module.exports = { parseDiffFile, parseDiffString };
