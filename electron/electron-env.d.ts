/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer

  api: {
    createNote: (name: string, icon: string) => void;
    saveText: (name: string, text: string) => void;
    loadText: (name: string) => Promise<{text: string}>;
    loadTabs: () => Promise<Record<string, { icon: string }>>;
    deleteTab: (name: string) => void;
    editNote: (name: string, newname: string, newicon: string) => void;
    configSet: (key: string, value: any) => void;
    configGet: (key: string) => Promise<any>;
    // onGetLastActiveTab: (callback: () => void) => void;
    // sendLastActiveTab: (tab: string) => void;
  }
}
