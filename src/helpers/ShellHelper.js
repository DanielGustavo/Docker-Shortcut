const { GLib, Gio } = imports.gi;

class ShellHelper {
  execSync(command) {
    const [res, out, err, status] = GLib.spawn_command_line_sync(command);

    return {
      res,
      out: String.fromCharCode.apply(String, out),
      err,
      status,
    };
  }

  execInOtherTerminal(command) {
    const defaultShell = GLib.getenv('SHELL');

    const terminalCommand = `gnome-terminal -- ${defaultShell} -c '${command}'`;
    GLib.spawn_command_line_async(terminalCommand);
  }

  _readOutput(stream, lineBuffer) {
    stream.read_line_async(0, null, (currentStream, res) => {
      try {
        const line = currentStream.read_line_finish_utf8(res)[0];

        if (line !== null) {
          lineBuffer.push(line);
          this._readOutput(currentStream, lineBuffer);
        }
      } catch (error) {
        logError(error);
      }
    });
  }

  execAsync(command) {
    return new Promise((resolve, reject) => {
      try {
        const [, pid, stdin, stdout, stderr] = GLib.spawn_async_with_pipes(
          null,
          ['/bin/sh', '-c', `${command}`],
          null,
          GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
          null
        );

        GLib.close(stdin);

        const stdoutStream = new Gio.DataInputStream({
          base_stream: new Gio.UnixInputStream({
            fd: stdout,
            close_fd: true,
          }),
          close_base_stream: true,
        });

        const stdoutLines = [];
        this._readOutput(stdoutStream, stdoutLines);

        const stderrStream = new Gio.DataInputStream({
          base_stream: new Gio.UnixInputStream({
            fd: stderr,
            close_fd: true,
          }),
          close_base_stream: true,
        });

        const stderrLines = [];
        this._readOutput(stderrStream, stderrLines);

        GLib.child_watch_add(
          GLib.PRIORITY_DEFAULT_IDLE,
          pid,
          (currentPid, status) => {
            if (status === 0) {
              resolve(stdoutLines.join('\n'));
            } else {
              logError(new Error(stderrLines.join('\n')));
            }

            stdoutStream.close(null);
            stderrStream.close(null);
            GLib.spawn_close_pid(currentPid);
          }
        );
      } catch (error) {
        logError(error);
        reject(error);
      }
    });
  }
}

var shell = new ShellHelper();
