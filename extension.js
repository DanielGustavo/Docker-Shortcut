const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Menu } = Me.imports.src.ui.Menu;

class Extension {
  enable() {
    this.menu = new Menu();
    this.menu.enable();
  }

  disable() {
    this.menu.disable();
  }
}

function init() {
  return new Extension();
}
