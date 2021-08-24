class NotificationHelper {
  constructor() {
    this.topics = {};
  }

  on(topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    this.topics[topic].push(callback);
  }

  emit(topic, data) {
    const callbacks = this.topics[topic];

    if (!callbacks) return;

    callbacks.forEach((callback) => {
      callback(data);
    });
  }
}

var notifier = new NotificationHelper();
