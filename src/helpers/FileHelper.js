const Me = imports.misc.extensionUtils.getCurrentExtension();

const { shell } = Me.imports.src.helpers.ShellHelper;

class FileHelper {
  write(filename, content = '') {
    const parsedContent = content
      .replace(/"/g, '\\"')
      .replace(/\\\\"/g, '\\\\\\"');

    shell.execAsync(`/bin/sh -c "echo '${parsedContent}' > ${filename}"`);
  }

  async read(filename) {
    const output = await shell.execAsync(`cat ${filename}`);

    return new Promise((resolve) => {
      resolve(output);
    });
  }
}

var file = new FileHelper();
