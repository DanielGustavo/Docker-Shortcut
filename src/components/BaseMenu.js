const { St } = imports.gi;
const { popupMenu: PopupMenu } = imports.ui;

var BaseMenu = class BaseMenu {
  addText(title = 'Text', styleClasses = []) {
    const text = new PopupMenu.PopupMenuItem(title, {
      style_class: `menu-text ${styleClasses.join(' ')}`,
      reactive: false,
    });
    this.menu.addMenuItem(text);

    return text;
  }

  addButton(
    title = 'Button',
    onClick = () => {
      log('clicked');
    },
    styleClasses = []
  ) {
    const button = new PopupMenu.PopupMenuItem(title, {
      style_class: `menu-button ${styleClasses.join(' ')}`,
    });
    this.menu.addMenuItem(button);
    button.connect('activate', onClick);

    return button;
  }

  addItem(item) {
    return this.menu.addMenuItem(item);
  }

  addSeparator() {
    return this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
  }

  addInput({
    name,
    styleClasses = [],
    placeholder = 'Placeholder',
    value,
    onChange = (inputValue) => {
      log(inputValue);
    },
  }) {
    const input = new St.Entry({
      name,
      style_class: `input ${styleClasses.join(' ')}`,
      can_focus: true,
      hint_text: placeholder,
      track_hover: true,
    });

    input.set_text(value);

    const menuItem = new PopupMenu.PopupMenuItem('', { reactive: false });
    menuItem.actor.add(input);

    this.addItem(menuItem);

    input.get_clutter_text().connect('text-changed', () => {
      onChange(input.get_text());
    });

    return input;
  }
};
