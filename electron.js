const {app, BrowserWindow, Menu, nativeImage} = require('electron');
var path = require('path');

var win;

function createWindow() {
  var image = nativeImage.createFromPath('assets/img/logo.png');

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Formula Manager',
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
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
