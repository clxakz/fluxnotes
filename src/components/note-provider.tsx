import { createContext, ReactNode, useContext } from "react";
import { useGlobalState } from "./globalstate-provider";


type NoteContextType = {
    createNote: (name: string, icon: string) => void;
    saveNote: (name: string, text: string) => void;
    loadText: (name: string) => Promise<string>;
    loadTabs: () => Promise<Record<string, { icon: string; }>>;
    deleteTab: (name: string) => void;
    editNote: (name: string, newname: string, newicon: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export default function NoteProvider({ children }: { children: ReactNode }) {
    const { addTab, removeTab, clearEditor, setActiveTab, configSet } = useGlobalState();

    const createNote = (name: string, icon: string) => {
        window.api.createNote(name, icon);
        addTab({name, icon});
    }

    const saveNote = (name: string, text: string) => {
        window.api.saveText(name, text);
    }

    const editNote = (name: string, newname: string, newicon: string) => {
        window.api.editNote(name, newname, newicon);
    }

    const loadText = async (name: string) => {
        const result = await window.api.loadText(name);
        return result.text
    }

    const loadTabs = async () => {
        const result = await window.api.loadTabs();
        return result;
    }

    const deleteTab = async (name: string) => {
        clearEditor();
        setActiveTab('');
        configSet("lastactivetab", null);
        await window.api.deleteTab(name);
        removeTab(name);
    }

    return (
        <NoteContext.Provider value={{editNote, deleteTab, loadTabs, loadText, createNote, saveNote}}>
            { children }
        </NoteContext.Provider>
    )
}


export function useNote() {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error(
            "useNote must be used within a NoteProvider"
        );
    }
    return context;
}