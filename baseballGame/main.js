const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isWindowFullscreen = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    fullscreen: true, // plná obrazovka při startu
    resizable: true,
    icon: path.join(__dirname, 'src', 'images', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // aby require fungovalo v rendereru
      enableRemoteModule: true,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'))
    .catch(err => console.error('Nelze načíst index.html:', err));

  // Volitelně: otevře DevTools
  // mainWindow.webContents.openDevTools();

  // Zamezení automatického zavření na Macu
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // --- Upravené chování změny velikosti: vždy měnit rozměry souměrně kolem středu okna ---
  mainWindow.on('will-resize', (event, newBounds) => {
    // Pokud je fullscreen nebo maximalizované, nechceme přepisovat resize
    if (!mainWindow || mainWindow.isFullScreen() || mainWindow.isMaximized()) return;

    // Zrušíme výchozí chování a nastavíme vlastní bounds
    event.preventDefault();

    const oldBounds = mainWindow.getBounds();
    const centerX = oldBounds.x + oldBounds.width / 2;
    const centerY = oldBounds.y + oldBounds.height / 2;

    // Minimální rozměry (upravit podle potřeby)
    const minWidth = 400;
    const minHeight = 300;

    // Poměry změny
    const widthRatio = newBounds.width / oldBounds.width;
    const heightRatio = newBounds.height / oldBounds.height;

    // Určíme škálovací faktor tak, aby se změna provedla souměrně:
    // - pokud uživatel zvětšuje/zmenšuje obě osy, použijeme při zmenšování menší faktor (fit) a při zvětšování větší faktor (fill),
    // - pokud mění jen jednu osu, použijeme ten poměr, který se skutečně změnil.
    let factor;
    const widthChanged = Math.abs(widthRatio - 1) > 1e-3;
    const heightChanged = Math.abs(heightRatio - 1) > 1e-3;

    if (widthChanged && heightChanged) {
      if (widthRatio < 1 && heightRatio < 1) {
        // obě osy se zmenšují -> použij menší faktor (zachová se chování jako u rohu při zmenšování)
        factor = Math.min(widthRatio, heightRatio);
      } else if (widthRatio > 1 && heightRatio > 1) {
        // obě osy se zvětšují -> použij větší faktor (uživatel chce větší okno)
        factor = Math.max(widthRatio, heightRatio);
      } else {
        // různé směry změny (méně časté) -> vyber tu osu, která se mění výrazněji
        factor = (Math.abs(widthRatio - 1) >= Math.abs(heightRatio - 1)) ? widthRatio : heightRatio;
      }
    } else if (widthChanged) {
      factor = widthRatio;
    } else if (heightChanged) {
      factor = heightRatio;
    } else {
      // žádná změna (bezpečnostní fallback)
      factor = 1;
    }

    // Nové rozměry zachovávající poměr
    let newWidth = Math.round(oldBounds.width * factor);
    let newHeight = Math.round(oldBounds.height * factor);

    // Aplikuj minimální limity
    newWidth = Math.max(newWidth, minWidth);
    newHeight = Math.max(newHeight, minHeight);

    // Přepočítej středově zarovnanou pozici
    const x = Math.round(centerX - newWidth / 2);
    const y = Math.round(centerY - newHeight / 2);

    // Nastav nové rozměry a pozici
    mainWindow.setBounds({ x, y, width: newWidth, height: newHeight });
  });
}

// --- IPC pro ukončení aplikace z rendereru ---
ipcMain.on('app-quit', () => {
  app.quit();
});

// --- IPC pro okna ---
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-hide', () => {
  if (!mainWindow) return;

  if (isWindowFullscreen) {
    // Pokud je fullscreen, přepnout na zmenšené okno
    mainWindow.setFullScreen(false);

    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
    const newWidth = 1600;
    const newHeight = 900;
    const x = Math.floor((width - newWidth) / 2);
    const y = Math.floor((height - newHeight) / 2);

    mainWindow.setBounds({ x, y, width: newWidth, height: newHeight });
    isWindowFullscreen = false;
  } else {
    // Pokud je zmenšené, přepnout zpět na fullscreen
    mainWindow.setFullScreen(true);
    isWindowFullscreen = true;
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('get-window-mode', () => {
  return isWindowFullscreen ? 'fullscreen' : 'windowed';
});

ipcMain.on('set-window-mode', (event, { mode }) => {
  if (!mainWindow) return;
  const isFull = mode === 'fullscreen';
  mainWindow.setFullScreen(isFull);

  if (!isFull) {
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
    const newWidth = 1600;
    const newHeight = 900;
    const x = Math.floor((width - newWidth) / 2);
    const y = Math.floor((height - newHeight) / 2);
    mainWindow.setBounds({ x, y, width: newWidth, height: newHeight });
  }

  isWindowFullscreen = isFull;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});