const Me = imports.misc.extensionUtils.getCurrentExtension();
const { shell } = Me.imports.src.helpers.ShellHelper;
const { notifier } = Me.imports.src.helpers.NotificationHelper;
const { file } = Me.imports.src.helpers.FileHelper;

class DockerHelper {
  constructor() {
    this.customCommands = {};

    this.loadCustomCommands();
  }

  async loadCustomCommands() {
    const customCommandsInStringfiedJSON = await file.read(
      '~/.dockerIntegrationCustomShellCommandsToContainers.json'
    );

    const customCommands = JSON.parse(customCommandsInStringfiedJSON);
    this.customCommands = customCommands;
  }

  getCustomCommandFromContainer(containerId) {
    return this.customCommands[containerId] || '';
  }

  setCustomCommandToContainer(containerId, command) {
    this.customCommands[containerId] = command;

    file.write(
      '~/.dockerIntegrationCustomShellCommandsToContainers.json',
      JSON.stringify(this.customCommands)
    );
  }

  async loadContainers() {
    const output = await shell.execAsync(
      "docker ps -a --format '{{.ID}},{{.Names}},{{.Status}}'"
    );

    return new Promise((resolve) => {
      const containers = output.trim().split('\n');

      const containersDatas = containers.map((container) => {
        const [id, name, containerFullStatus] = container.split(',');

        const isPaused =
          containerFullStatus.toLowerCase().indexOf('paused') > -1;
        const isUp = containerFullStatus.toLowerCase().indexOf('up') > -1;

        let containerStatus = 'stopped';

        if (isPaused) {
          containerStatus = 'paused';
        } else if (isUp) {
          containerStatus = 'started';
        }

        return { id, name, status: containerStatus };
      });

      resolve(containersDatas);
    });
  }

  getContainersPrefixSeparator() {
    return this.settings
      ? this.settings.get_string('containers-prefix-separator') || '_'
      : '_';
  }

  _separateContainersIntoGroups(containers) {
    const containersPrefixSeparator = this.getContainersPrefixSeparator();
    const containersPrefixes = new Set();

    containers.forEach((container) => {
      const prefix = container.name.split(containersPrefixSeparator)[0];

      if (prefix) {
        containersPrefixes.add(prefix);
      }
    });

    const containersGroups = {};

    containersPrefixes.forEach((prefix) => {
      const containersMatchingPrefix = containers.filter((container) => {
        const currentContainerPrefix = container.name.split(
          containersPrefixSeparator
        )[0];

        return currentContainerPrefix === prefix;
      });

      if (containersMatchingPrefix.length > 1) {
        containersGroups[prefix] = containersMatchingPrefix;
      }
    });

    return containersGroups;
  }

  async loadContainersGroups() {
    const containers = await this.loadContainers();

    return new Promise((resolve) => {
      const containersGroups = this._separateContainersIntoGroups(containers);
      resolve(containersGroups);
    });
  }

  async loadContainersWithoutGroup() {
    const containersPrefixSeparator = this.getContainersPrefixSeparator();
    const containers = await this.loadContainers();

    return new Promise((resolve) => {
      const containersGroups = this._separateContainersIntoGroups(containers);

      const containersGroupsPrefixes = Object.keys(containersGroups);

      const containersWithoutGroup = containers.filter((container) => {
        const containerPrefix = container.name.split(
          containersPrefixSeparator
        )[0];

        return !containersGroupsPrefixes.includes(containerPrefix);
      });

      resolve(containersWithoutGroup);
    });
  }

  _notifyChange() {
    notifier.emit('containerChange');
  }

  async unpauseContainer(containerId) {
    const output = await shell.execAsync(`docker unpause ${containerId}`);
    this._notifyChange(output);
  }

  async pauseContainer(containerId) {
    const output = await shell.execAsync(`docker pause ${containerId}`);
    this._notifyChange(output);
  }

  viewContainerLogs(containerId) {
    shell.execInOtherTerminal(`docker logs -f ${containerId}`);
  }

  openContainerShell(containerId) {
    let customCommand = this.getCustomCommandFromContainer(containerId);
    customCommand = customCommand ? ` -c "${customCommand}"` : '';

    shell.execInOtherTerminal(
      `docker exec -it ${containerId} /bin/bash${customCommand}; if [ $? -ne 0 ]; then docker exec -it ${containerId} /bin/sh${customCommand}; fi;`
    );
  }

  async stopContainer(containerId) {
    const output = await shell.execAsync(`docker stop ${containerId}`);
    this._notifyChange(output);
  }

  async startContainer(containerId) {
    const output = await shell.execAsync(`docker start ${containerId}`);
    this._notifyChange(output);
  }

  async removeContainer(containerId) {
    const output = await shell.execAsync(`docker rm ${containerId}`);
    this._notifyChange(output);
  }

  restartContainer(containerId) {
    shell.execAsync(`docker restart ${containerId}`);
  }
}

var docker = new DockerHelper();
