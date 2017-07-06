const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
let SqlManager = require('./modules/sqlManager');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 850});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  //NOTE: Custom stuff here.
  ipcMain.on('runQuery', (event, data) => {
    SqlManager.query(data.config, data.query, (err, result) => {
      console.log('Done. Time to reply');
      // result.columns = result.recordset.columns;
      let tables = [];
      if (!err) {
        result.recordsets.forEach((recordset) => {
          let table = recordset.toTable();
          table.rows = table.rows.map((row) => {
            let newRow = row.map((column) => {
              return {
                value: column,
                active: false
              }
            });
            return newRow;
          });
          tables.push(table);
        });
      }
      console.log('Sending');
      event.sender.send('runQuery-reply', {
        error: err,
        tables,
        rowsAffected: result != null ? result.rowsAffected : 0
      });
    });
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.