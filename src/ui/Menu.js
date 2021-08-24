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
  }

  renderMenu() {
    this.containersGroups = docker.loadContainersGroups();

    if (this.page === 'default') {
      this.handleDefaultPage();
    } else if (this.page !== undefined) {
      this.handleContainersGroupPage();
    } else {
      this.addText('Loading...');
    }

    notifier.on('containerChange', () => {
      this.refreshMenu();
    });
  }

  changePage(page) {
    this.page = page;
    this.refreshMenu();
  }

  handleDefaultPage() {
    this.addText('Groups');

    const containersWithoutGroup = docker.loadContainersWithoutGroup();
    const containersGroupsPrefixes = Object.keys(this.containersGroups);

    containersGroupsPrefixes.forEach((prefix) => {
      this.addButton(prefix, () => {
        this.changePage(prefix);
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
