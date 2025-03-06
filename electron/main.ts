import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { loadTabs, Note } from './note'
import Store from 'electron-store';
const store = new Store({ name: "config" });

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Fluxnotes",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      height: 25,
      color: "rgba(255, 255, 255, 0)",
      symbolColor: "rgb(128, 128, 128)"
    },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Hide menu-bar
  win.setMenu(null);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
    createWindow();

    ipcMain.on("note-create", (_event, name: string, icon: string) => {
        console.log("on create main: ", name, icon)
        const note = new Note(name, icon);
        note.save();
    });

    ipcMain.on("note-savetext", (_event, name: string, text: string) => {
        const note = new Note(name, undefined, text);
        note.save();
    });

    ipcMain.handle("note-gettext", async (_event, name: string) => {
        const note = new Note(name);
        const result = await note.load();
        return result;
    });

    ipcMain.handle("loadtabs", async (_event) => {
        return await loadTabs();
    });

    ipcMain.on("note-delete", async (_event, name: string) => {
        const note = new Note(name);
        await note.delete();
    });

    ipcMain.on("note-edit", async (_event, name: string, newname: string, newicon: string) => {
        const note = new Note(name);
        await note.edit(newname, newicon);
    })

    ipcMain.on("config-set", (_event, key: string, value: any) => {
        store.set(key, value);
    });

    ipcMain.handle("config-get", async (_event, key: string) => {
        console.log("getting")
        return await store.get(key);
    });
});
