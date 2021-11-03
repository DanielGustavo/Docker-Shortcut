const { GObject, Gtk } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { PrefsWidget } = Me.imports.src.components.PrefsWidget;
const { docker } = Me.imports.src.helpers.DockerHelper;

var Prefs = class Prefs extends PrefsWidget {
  _init({ settings }) {
    super._init({ uiFilename: '/prefs.glade' });
    this._drawWindow();

    this.addEventListener('containers_prefix_separator_changed', (widget) => {
      settings.set_string('containers-prefix-separator', widget.get_text());
    });

    const containersPrefixSeparatorInput = this.getObject(
      'containers_prefix_separator_input'
    );

    containersPrefixSeparatorInput.set_text(
      docker.getContainersPrefixSeparator()
    );
  }

  _drawWindow() {
    const grid = this.getObject('grid');
    this.add(grid);
  }
};

Prefs = GObject.registerClass({ GTypeName: 'Prefs' }, Prefs);
