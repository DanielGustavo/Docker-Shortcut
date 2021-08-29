const { St, Gio, GObject } = imports.gi;
const { popupMenu: PopupMenu, panelMenu: PanelMenu, main: Main } = imports.ui;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { BaseMenu } = Me.imports.src.components.BaseMenu;
const { SubMenu } = Me.imports.src.components.SubMenu;
const { extendMultipleClasses } = Me.imports.src.utils.extendMultipleClasses;

var Menu = class Menu extends PanelMenu.Button {
  _init() {
    super._init(0.0, _('Docker Shortcut Menu'));

    const iconButton = new St.BoxLayout({
      style_class: 'panel-status-menu-box',
    });
    const gicon = Gio.icon_new_for_string(`${Me.path}/images/icon.svg`);
    const iconImage = new St.Icon({ gicon, icon_size: '24' });

    this.add_child(iconButton);
    this.connect('button_press_event', this.refreshMenu.bind(this));

    iconButton.add_child(iconImage);

    this.renderMenu();
    this.show();
  }

  refreshMenu() {
    if (this.menu.isOpen) {
      this.menu.removeAll();

      this.renderMenu();
      this.show();
    }
  }

  removeElements() {
    this.menu.removeAll();
  }

  renderMenu() {
    this.addText('Menu...');
  }

  enable() {
    Main.panel.addToStatusArea('docker-menu', this);
  }

  disable() {
    this.destroy();
  }
};

extendMultipleClasses(Menu, [BaseMenu]);

Menu = GObject.registerClass({ GTypeName: 'MenuComponent' }, Menu);
