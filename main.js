const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

}

app.whenReady().then(() => { createWindow() });

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') 
        app.quit()
    }
);

const { exec } = require('child_process');


ipcMain.on("renderer/compile", (event, message) => {
  if (!mainWindow) return;

  try {
    exec(`node -p '${message.replaceAll("'", "\"")}'`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      event.reply("main/compiled", stdout);
    });

  } catch (error) {
    event.reply("main/compiled", error.message);
  }
});