const Me = imports.misc.extensionUtils.getCurrentExtension();

const { shell } = Me.imports.src.helpers.ShellHelper;
const { notifier } = Me.imports.src.helpers.NotificationHelper;
const { file } = Me.imports.src.helpers.FileHelper;

class DockerHelper {
  constructor() {
    this.customCommands = {};

    const setCustomCommands = (fileContent) => {
      const customCommands = JSON.parse(fileContent);
      this.customCommands = customCommands;
    };

    file.read(
      '~/.dockerIntegrationCustomShellCommandsToContainers.json',
      setCustomCommands
    );
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

  loadContainers() {
    const { out, status } = shell.execSync(
      "docker ps -a --format '{{.ID}},{{.Names}},{{.Status}}'"
    );

    if (status !== 0) {
      throw new Error('Loading the containers was not possible');
    }

    const containers = out.trim().split('\n');

    const containersDatas = containers.map((container) => {
      const [id, name, containerFullStatus] = container.split(',');

      const isPaused = containerFullStatus.toLowerCase().indexOf('paused') > -1;
      const isUp = containerFullStatus.toLowerCase().indexOf('up') > -1;

      let containerStatus = 'stopped';

      if (isPaused) {
        containerStatus = 'paused';
      } else if (isUp) {
        containerStatus = 'started';
      }

      return { id, name, status: containerStatus };
    });

    return containersDatas;
  }

  loadContainersGroups() {
    const containers = this.loadContainers();

    const containersPrefixes = new Set();

    containers.forEach((container) => {
      const prefix = container.name.split('_')[0];

      if (prefix) {
        containersPrefixes.add(prefix);
      }
    });

    const containersGroups = {};

    containersPrefixes.forEach((prefix) => {
      const containersMatchingPrefix = containers.filter((container) => {
        const currentContainerPrefix = container.name.split('_')[0];
        return currentContainerPrefix === prefix;
      });

      if (containersMatchingPrefix.length > 1) {
        containersGroups[prefix] = containersMatchingPrefix;
      }
    });

    return containersGroups;
  }

  loadContainersWithoutGroup() {
    const containers = this.loadContainers();
    const containersGroups = this.loadContainersGroups();

    const containersGroupsPrefixes = Object.keys(containersGroups);

    const containersWithoutGroup = containers.filter((container) => {
      const containerPrefix = container.name.split('_')[0];

      return !containersGroupsPrefixes.includes(containerPrefix);
    });

    return containersWithoutGroup;
  }

  _notifyChange() {
    notifier.emit('containerChange');
  }

  unpauseContainer(containerId) {
    shell.execAsync(`docker unpause ${containerId}`, this._notifyChange);
  }

  pauseContainer(containerId) {
    shell.execAsync(`docker pause ${containerId}`, this._notifyChange);
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

  stopContainer(containerId) {
    shell.execAsync(`docker stop ${containerId}`, this._notifyChange);
  }

  startContainer(containerId) {
    shell.execAsync(`docker start ${containerId}`, this._notifyChange);
  }

  removeContainer(containerId) {
    shell.execAsync(`docker rm ${containerId}`, this._notifyChange);
  }

  restartContainer(containerId) {
    shell.execAsync(`docker restart ${containerId}`);
  }
}

var docker = new DockerHelper();
