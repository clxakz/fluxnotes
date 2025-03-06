import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld("api", {
    createNote: (name: string, icon: string) => ipcRenderer.send("note-create", name, icon),
    saveText: (name: string, text: string) => ipcRenderer.send("note-savetext", name, text),
    loadText: (name: string) => ipcRenderer.invoke("note-gettext", name),
    loadTabs: () => ipcRenderer.invoke("loadtabs"),
    deleteTab: (name: string) => ipcRenderer.send("note-delete", name),
    editNote: (name: string, newname: string, newicon: string) => ipcRenderer.send("note-edit", name, newname, newicon),
    configSet: (key: string, value: any) => ipcRenderer.send("config-set", key, value),
    configGet: (key: string) => ipcRenderer.invoke("config-get", key),
    // onGetLastActiveTab: (callback: () => void) => ipcRenderer.on("get-last-active-tab", callback),
    // sendLastActiveTab: (tab: string) => ipcRenderer.send("send-last-active-tab", tab),
})