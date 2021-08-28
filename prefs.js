const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Prefs } = Me.imports.src.ui.Prefs;

function init() {}

function buildPrefsWidget() {
  const prefs = new Prefs();
  prefs.build();
  return prefs;
}
