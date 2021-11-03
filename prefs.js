const { getSettings } = imports.misc.extensionUtils;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Prefs } = Me.imports.src.ui.Prefs;

function init() {}

function buildPrefsWidget() {
  const settings = getSettings();

  const prefs = new Prefs({ settings });
  prefs.build();

  return prefs;
}
