const { GObject } = imports.gi;
const Dialog = imports.ui.dialog;
const ModalDialog = imports.ui.modalDialog;

var Modal = class Modal extends ModalDialog.ModalDialog {
  _init({ message, title }) {
    super._init();

    this.message = message;
    this.title = title;

    this._buildLayout.bind(this)();
  }

  _buildLayout() {
    const messageDialogContentParams = {
      title: this.title,
    };

    if (Dialog.MessageDialogContent.prototype.hasOwnProperty('description')) {
      messageDialogContentParams.description = this.message;
    } else {
      messageDialogContentParams.subtitle = this.message;
    }

    const content = new Dialog.MessageDialogContent(messageDialogContentParams);
    this.contentLayout.add_actor(content);
  }
};

Modal = GObject.registerClass({ GTypeName: 'Modal' }, Modal);
