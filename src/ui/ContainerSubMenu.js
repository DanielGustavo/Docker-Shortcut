const { GObject } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const { SubMenu } = Me.imports.src.components.SubMenu;
const { ConfirmationModal } = Me.imports.src.ui.ConfirmationModal;
const { docker } = Me.imports.src.helpers.DockerHelper;
const { shell } = Me.imports.src.helpers.ShellHelper;

var ContainerSubMenu = class ContainerSubMenu extends SubMenu {
  _init(container) {
    super._init(`${container.name}`);

    this.container = container;

    const statusHandlers = {
      stopped: this.handleStoppedStatus,
      started: this.handleStartedStatus,
      paused: this.handlePausedStatus,
    };

    const statusHandler = statusHandlers[container.status];
    if (statusHandler) {
      statusHandler.bind(this)();
    }
  }

  handleStoppedStatus() {
    const { id, name } = this.container;

    this.addIcon({
      icon: 'media-playback-stop-symbolic',
      styleClasses: ['stopped-status'],
    });

    this.addButton(`Start`, () => docker.startContainer(id));
    this.addButton('Remove', () => {
      const modal = new ConfirmationModal(
        `Are you sure you want to delete "${name}" container?`,
        () => docker.removeContainer(id)
      );

      modal.open();
    });
  }

  handleStartedStatus() {
    const { id } = this.container;
    const customCommand = docker.getCustomCommandFromContainer(id);

    this.addIcon({
      icon: 'media-playback-start-symbolic',
      styleClasses: ['started-status'],
    });

    this.addButton('Open shell', () => docker.openContainerShell(id));
    this.addButton('View logs', () => docker.viewContainerLogs(id));
    this.addButton('Pause', () => docker.pauseContainer(id));
    this.addButton('Restart', () => docker.restartContainer(id));
    this.addButton('Stop', () => docker.stopContainer(id));

    this.addSeparator();

    this.addInput({
      name: id,
      placeholder: 'Custom command',
      value: customCommand,
      onChange: (value) => {
        docker.setCustomCommandToContainer(id, value);
      },
    });
  }

  handlePausedStatus() {
    const { id } = this.container;

    this.addIcon({
      icon: 'media-playback-pause-symbolic',
      styleClasses: ['paused-status'],
    });

    this.addButton('Unpause', () => docker.unpauseContainer(id));
  }
};

ContainerSubMenu = GObject.registerClass(
  { GTypeName: 'ContainerSubMenu' },
  ContainerSubMenu
);
