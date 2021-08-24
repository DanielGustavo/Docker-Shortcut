const { GObject } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const { Modal } = Me.imports.src.components.Modal;

var ConfirmationModal = class ConfirmationModal extends Modal {
  _init(message, callback) {
    super._init({ title: 'Confirm action', message });

    this.addButton({
      label: 'Cancel',
      action: this._cancel.bind(this),
      default: true,
    });

    this.addButton({
      label: 'Confirm',
      action: () => {
        callback();
        this.close();
      },
      default: true,
    });
  }

  _cancel() {
    this.close();
  }
};

ConfirmationModal = GObject.registerClass(
  { GTypeName: 'ConfirmationModal' },
  ConfirmationModal
);
