const { GObject, Gtk } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();

var PrefsWidget = class PrefsWidget extends Gtk.ScrolledWindow {
  _init({ uiFilename }, params) {
    super._init(params);

    this.connect('destroy', Gtk.main_quit);
    this.builder = new Gtk.Builder();

    if (uiFilename) {
      this.builder.add_from_file(`${Me.path}${uiFilename}`);
    }
  }

  getObject(objectName) {
    return this.builder.get_object(objectName);
  }

  addEventListener(event, callback) {
    this.builder.connect_signals_full((_, object, signal, handler) => {
      if (handler === event) {
        object.connect(signal, callback.bind(this));
      }
    });
  }

  build() {
    this.show_all();
  }
};

PrefsWidget = GObject.registerClass({ GTypeName: 'PrefsWidget' }, PrefsWidget);
