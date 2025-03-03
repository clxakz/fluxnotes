import { PathLike } from 'fs';
import { join } from 'path';
import fs from "node:fs/promises";

const savePath: PathLike = join("C:/Users/ivox/desktop", "notesdb.json");


async function readDb() {
    try {
        const data = await fs.readFile(savePath, "utf8");
        return JSON.parse(data) || {};
    } catch (error: any) {
        if (error.code === "ENOENT") return {};
        throw error;
    }
}


async function writeDb(data: Record<string, { icon?: string; text?: string }>) {
    await fs.writeFile(savePath, JSON.stringify(data, null, 2));
}

export async function loadTabs() {
    const data = await readDb();
    return data;
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
        const db = await readDb();

        
        db[this.name] = {
            icon: this.icon ?? db[this.name]?.icon,
            text: this.text,
        };
        
        await writeDb(db);
    }

    async load() {
        const db = await readDb();
        return db[this.name] ?? null
    }

    async edit(newname: string, newicon: string) {
        const db = await readDb();
        const note = db[this.name];

        delete db[this.name];
        db[newname] = { 
            icon: newicon,
            text: note.text,
        };

        await writeDb(db);
        
    }

    async delete() {
        const db = await readDb();
        delete db[this.name];
        await writeDb(db);
    }
}