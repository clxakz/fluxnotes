import Store from 'electron-store';
// import { app, desktopCapturer } from 'electron';
import { join } from 'path'; 

// const desktopPath = app.getPath('desktop');
const SavePath = join("c:", "users", "ivox", "desktop")
const store = new Store({ cwd: SavePath, name: "notesDB" });


type NoteType = {
    icon?: string;
    text?: string;
}


export async function loadTabs(): Promise<Record<string, NoteType>> {
    return store.get('notes', {}) as Record<string, NoteType>;
}

export class Note {
    name: string;
    icon?: string;
    text?: string;

    constructor(name: string, icon?: string, text?: string) {
        this.name = name;
        this.icon = icon;
        this.text = text;
    }

    async save() {
        const db: Record<string, NoteType> = await loadTabs();

        db[this.name] = {
            icon: this.icon ?? db[this.name]?.icon,
            text: this.text,
        };

        store.set('notes', db);
    }

    async load() {
        const db: Record<string, NoteType> = await loadTabs();
        return db[this.name];
    }

    async edit(newname: string, newicon: string) {
        const db: Record<string, NoteType> = await loadTabs();
        const note = db[this.name];

        delete db[this.name];
        db[newname] = {
            icon: newicon,
            text: note.text,
        };

        store.set('notes', db);
    }

    async delete() {
        const db: Record<string, NoteType> = await loadTabs();
        delete db[this.name];
        store.set('notes', db);
    }
}