      NEW_FMODE: /^new file mode \d{6}$/,
      DELETED_FMODE: /^deleted file mode \d{6}$/,
      OLD_MODE: /^old mode \d{6}$/,
      NEW_MODE: /^new mode \d{6}$/,
      return new Token('FINISHED', null, this.cur + 1);
    if (line === '') {
      return new Token('EMPTY_LINE', '', this.cur + 1);
    }
    if (['ANY', 'EMPTY_LINE'].includes(this.stream.get().type)) {
    if (['DIFF', 'NEW_FMODE', 'DELETED_FMODE', 'OLD_MODE', 'INDEX', 'OLD_FILE'].includes(this.stream.get().type)) {
    // optional empty line at the end
    if (this.stream.get().type === 'EMPTY_LINE') {
      this.stream.next();
    }

    while (['ANY', 'EMPTY_LINE'].includes(this.stream.get().type)) {
    while (['DIFF', 'NEW_FMODE', 'DELETED_FMODE', 'OLD_MODE', 'INDEX', 'OLD_FILE'].includes(this.stream.get().type)) {
  rule_modes() {
    let fileMode = null;
    let oldMode = null;
    let newMode = null;
    const t = this.stream.get();
    switch (t.type) {
      case 'NEW_FMODE':
      case 'DELETED_FMODE':
        fileMode = this.stream.next();
        break;
      case 'OLD_MODE':
        oldMode = this.stream.next();

        newMode = this.stream.next();
        this.expect(newMode, 'NEW_MODE');

        break;
      default:
        this.expect(t, ['NEW_FMODE', 'DELETED_FMODE', 'OLD_MODE']);
    return {
      fileMode: fileMode !== null ? fileMode.content : null,
      oldMode: oldMode !== null ? oldMode.content : null,
      newMode: newMode !== null ? newMode.content : null,
    };
  }

  rule_diffBody() {
      case 'EMPTY_LINE':
        this.expect(t, ['CHUNK', 'DIFF', 'EMPTY_LINE', 'EOF']);
      oldFile: oldFile.content,
      newFile: newFile.content,
  rule_file() {
    // diff line
    let header = null;
    if (this.stream.get().type === 'DIFF') {
      header = this.stream.next();
    }

    // mode line (optional)
    let modes = null;
    if (['NEW_FMODE', 'DELETED_FMODE', 'OLD_MODE'].includes(this.stream.get().type)) {
      modes = this.rule_modes();
    }

    let diffBody = null;
    const t = this.stream.get();
    if (['INDEX', 'OLD_FILE'].includes(t.type)) {
      diffBody = this.rule_diffBody();
    } else if (modes.fileMode !== null) {
      // If no body & has file mode (new or deleted), it is an error
      this.expect(t, ['INDEX', 'OLD_FILE']);
    }

    return {
      header: header !==null ? header.content : null,
      fileMode: modes !==null ? modes.fileMode : null,
      oldMode: modes !==null ? modes.oldMode : null,
      newMode: modes !==null ? modes.newMode : null,
      index: diffBody !==null ? diffBody.index : null,
      oldFile: diffBody !==null ? diffBody.oldFile : null,
      newFile: diffBody !==null ? diffBody.newFile : null,
      chunks: diffBody !==null ? diffBody.chunks : null,
    };
  }
