const {app, BrowserWindow, Menu, nativeImage} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  let image = nativeImage.createFromPath('assets/img/logo.png');

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: image,
    title: 'Formula Manager 2.0'
  });

  Menu.setApplicationMenu(null);

  // load the dist folder from Angular
  win.loadURL('https://fhsons.zakscode.com/formulaManager');

  // Open the DevTools optionally:
  win.webContents.openDevTools();

  win.on('closed', () => (win = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
