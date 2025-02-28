import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld("api", {
    createNote: (name: string, icon: string) => ipcRenderer.send("note-create", name, icon),
    saveText: (name: string, text: string) => ipcRenderer.send("note-savetext", name, text),
    loadText: (name: string) => ipcRenderer.invoke("note-gettext", name),
    loadTabs: () => ipcRenderer.invoke("loadtabs"),
    deleteTab: (name: string) => ipcRenderer.send("note-delete", name),
    editNote: (name: string, newname: string, newicon: string) => ipcRenderer.send("note-edit", name, newname, newicon),
})