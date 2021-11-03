const { getSettings } = imports.misc.extensionUtils;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Menu } = Me.imports.src.ui.Menu;

class Extension {
  enable() {
    const settings = getSettings();

    this.menu = new Menu({ settings });
    this.menu.enable();
  }

  disable() {
    this.menu.disable();
  }
}

function init() {
  return new Extension();
}
