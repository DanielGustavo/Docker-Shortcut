const { Gio } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();

var getSettings = () => {
  const GioSettingsSchemaSource = Gio.SettingsSchemaSource;

  const schemaSource = GioSettingsSchemaSource.new_from_directory(
    Me.dir.get_child('schemas').get_path(),
    GioSettingsSchemaSource.get_default(),
    false
  );

  const schemaObj = schemaSource.lookup(
    'org.gnome.shell.extensions.dockershortcut',
    true
  );

  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }

  return new Gio.Settings({ settings_schema: schemaObj });
};
