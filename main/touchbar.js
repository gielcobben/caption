const { TouchBar, shell } = require("electron");

const { TouchBarButton, TouchBarSpacer } = TouchBar;
const { showAboutWindow } = require("./windows/about");

const aboutCaptionButton = new TouchBarButton({
  label: "🎬 About Caption",
  click: () => {
    showAboutWindow();
  },
});

const donateButton = new TouchBarButton({
  label: "💰 Donate",
  click: () => {
    shell.openExternal("https://www.paypal.me/gielcobben");
  },
});

const touchBar = new TouchBar([
  new TouchBarSpacer({ size: "flexible" }),
  aboutCaptionButton,
  new TouchBarSpacer({ size: "large" }),
  donateButton,
  new TouchBarSpacer({ size: "flexible" }),
]);

module.exports = touchBar;
