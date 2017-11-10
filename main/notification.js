const { Notification } = require("electron");

const notification = message => {
  if (Notification.isSupported()) {
    const notify = new Notification({
      title: "Caption",
      body: message,
    });
    notify.show();
  }
};

module.exports = notification;
