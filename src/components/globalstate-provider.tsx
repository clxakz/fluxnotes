import { createContext, ReactNode, useContext, useState } from "react";
import { Paperclip, Scroll } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

type TabType = {
    name: string;
    icon: string;
}

type GlobalStateContextType = {
    NoteIcons: { [key: string]: ReactNode };
    settingsOpen: boolean;
    toggleSettings: () => void;
    newNoteDialogOpen: boolean;
    toggleNewNoteDialog: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    tabs: TabType[];
    addTab: (tab: TabType) => void;
    removeTab: (name: string) => void;
    hasTab: (name: string) => boolean;
    editTab: (name: string, newname: string, newicon: string) => void;
    activeTab: string;
    setActiveTab: (name: string) => void;
    editorText: string;
    insertText: (text: string) => void;
    clearEditor: () => void;
    editNoteDialogOpen: boolean;
    toggleEditNoteDialog: () => void;
    sidebarCanClose: boolean;
    setSidebarCanClose: (state: boolean) => void;
}


const GlobalStateContext  = createContext<GlobalStateContextType | undefined>(undefined);

export default function GlobalStateProvider({ children }: {children: ReactNode}) {
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const toggleSettings = () => setSettingsOpen((prev) => !prev);

    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);
    const toggleNewNoteDialog = () => setNewNoteDialogOpen((prev) => !prev);

    const [editNoteDialogOpen, setEditNoteDialogOpen] = useState<boolean>(false);
    const toggleEditNoteDialog = () => setEditNoteDialogOpen((prev) => !prev);

    const { setOpen, open } = useSidebar();
    const openSidebar = () => setOpen(true);
    const closeSidebar = () => setOpen(sidebarCanClose ? false : open);

    const [sidebarCanClose, setSidebarCanClose] = useState<boolean>(true);

    const [tabs, setTabs] = useState<TabType[]>([]);
    const addTab = (tab: TabType) => setTabs((prev) => [...prev, tab]);
    const removeTab = (name: string) => setTabs((prev: TabType[]) => prev.filter(tab => tab.name !== name));
    const hasTab = (name: string) => { return tabs.some(tab => tab.name === name) };
    const editTab = (name: string, newname: string, newicon: string) => setTabs(prevTabs => prevTabs.map(tab => tab.name === name ? { ...tab, name: newname, icon: newicon } : tab));

    const [activeTab, setActiveTab] = useState<string>('');

    const [editorText, setText] = useState<string>('');
    const insertText = (text: string) => setText(text);
    const clearEditor = () => setText('');

    const NoteIcons = {
        Paperclip: <Paperclip/>,
        Scroll: <Scroll />
    }

    return (
        <GlobalStateContext.Provider value={{ editTab, sidebarCanClose, setSidebarCanClose, editNoteDialogOpen, toggleEditNoteDialog, editorText, insertText, clearEditor, tabs, addTab, removeTab, hasTab, NoteIcons, toggleSettings, settingsOpen, toggleNewNoteDialog, newNoteDialogOpen, openSidebar, closeSidebar, setActiveTab, activeTab }}>
            {children}
        </GlobalStateContext.Provider>
    );
}


export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error(
            "useGlobalState must be used within a GlobalStateProvider"
        );
    }
    return context;
}