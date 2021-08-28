const { GObject } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const { Menu: MenuComponent } = Me.imports.src.components.Menu;
const { ContainerSubMenu } = Me.imports.src.ui.ContainerSubMenu;
const { docker } = Me.imports.src.helpers.DockerHelper;
const { notifier } = Me.imports.src.helpers.NotificationHelper;

var Menu = class Menu extends MenuComponent {
  _init() {
    super._init();

    this.page = 'default';

    notifier.on('containerChange', () => {
      this.refreshMenu();
    });
  }

  async renderMenu() {
    this.addText('Loading...');

    this.containersGroups = await docker.loadContainersGroups();
    this.removeElements();

    if (this.page === 'default' || this.page === undefined) {
      this.handleDefaultPage();
    } else if (this.page !== undefined) {
      this.handleContainersGroupPage();
    }
  }

  changePage(page) {
    this.page = page;
    this.refreshMenu();
  }

  async handleDefaultPage() {
    this.addText('Groups');

    const containersWithoutGroup = await docker.loadContainersWithoutGroup();
    const containersGroupsNames = Object.keys(this.containersGroups);

    containersGroupsNames.forEach((groupName) => {
      this.addButton(groupName, () => {
        this.changePage(groupName);
      });
    });

    this.addSeparator();
    this.addText('Containers');

    containersWithoutGroup.forEach((container) => {
      this.addItem(new ContainerSubMenu(container));
    });
  }

  handleContainersGroupPage() {
    const containers = this.containersGroups[this.page];

    if (!containers) {
      this.changePage('default');
      return;
    }

    this.addButton('Go back', () => {
      this.changePage('default');
    });

    this.addSeparator();
    this.addText('Containers');

    containers.forEach((container) => {
      this.addItem(new ContainerSubMenu(container));
    });
  }
};

Menu = GObject.registerClass({ GTypeName: 'Menu' }, Menu);
