const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'pages/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});

ipcMain.on('navigate', (event, page) => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `pages/${page}.html`),
      protocol: 'file:',
      slashes: true
    })
  );
});

ipcMain.on('search', (event, searchTerm) => {
  console.log('Received search request with term:', searchTerm);
  const data = JSON.parse(fs.readFileSync('pages/data.json', 'utf-8'));

  const results = data.filter(item => {
    const fieldsToSearch = ['title', 'path', 'error', 'name'];
    return fieldsToSearch.some(field => item[field].includes(searchTerm));
  });

  event.sender.send('search-results', results);
});

