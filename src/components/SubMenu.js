const { GObject, St } = imports.gi;

const { popupMenu: PopupMenu } = imports.ui;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { BaseMenu } = Me.imports.src.components.BaseMenu;
const { extendMultipleClasses } = Me.imports.src.utils.extendMultipleClasses;

var SubMenu = class SubMenu extends PopupMenu.PopupSubMenuMenuItem {
  _init(title) {
    super._init(title);
  }

  addIcon({
    icon = 'process-stop-symbolic',
    styleClasses = [],
    positionIndex = 1,
    iconSize = 14,
  }) {
    this.insert_child_at_index(
      new St.Icon({
        icon_name: icon,
        style_class: styleClasses.join(' '),
        icon_size: String(iconSize),
      }),
      positionIndex
    );
  }
};

extendMultipleClasses(SubMenu, [BaseMenu]);

SubMenu = GObject.registerClass({ GTypeName: 'SubMenu' }, SubMenu);
