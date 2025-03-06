import Store from 'electron-store';
// import { join } from 'path'; 


// const SavePath = join("c:", "users", "ivox", "desktop")
const store = new Store({ /*cwd: SavePath,*/ name: "notesDB" });


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

        console.log("saving: ", this.name, this.icon, this.text);

        db[this.name] = {
            icon: this.icon ?? db[this.name]?.icon,
            text: this.text,
        };

        store.set('notes', db);
    }

    async load() {
        const db: Record<string, NoteType> = await loadTabs();
        console.log("loading: ", this.name, this.icon, this.text);
        return db[this.name];
    }

    async edit(newname: string, newicon: string) {
        const db: Record<string, NoteType> = await loadTabs();
        console.log("editing: ", this.name, this.icon, this.text, newname, newicon);
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
        console.log("deleting: ", this.name, this.icon, this.text)
        delete db[this.name];
        store.set('notes', db);
    }
}