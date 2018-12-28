// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function createWindow () {

  const debugStartUrl = process.env.ELECTRON_START_URL;
  const debugMode = debugStartUrl ? true : false;

  let windowSize = {width:400, height:600};
  if(debugMode){
    windowSize = {width:1000, height:600};
  }

  // Create the browser window.
  mainWindow = new BrowserWindow(windowSize)

  // and load the index.html of the app.
  const startUrl = debugStartUrl || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  // mainWindow.loadFile('index.html')
  // mainWindow.loadURL('http://localhost:3000')
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('woza-desktop');
  });

  // Open the DevTools.
  if(debugMode){
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./ipcmain-code');
