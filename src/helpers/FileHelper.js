const Me = imports.misc.extensionUtils.getCurrentExtension();

const { shell } = Me.imports.src.helpers.ShellHelper;

class FileHelper {
  write(filename, content = '') {
    const parsedContent = content
      .replace(/"/g, '\\"')
      .replace(/\\\\"/g, '\\\\\\"');

    log(parsedContent);

    shell.execAsync(`/bin/sh -c "echo '${parsedContent}' > ${filename}"`);
  }

  read(filename, callback) {
    shell.execAsync(`cat ${filename}`, callback);
  }
}

var file = new FileHelper();
