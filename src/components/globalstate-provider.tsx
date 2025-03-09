import { createContext, ReactNode, useContext, useState } from "react";
import { Aperture, Component, File, Clipboard, Asterisk, Award, BadgeCheck, Book, BookHeart, Bookmark, BookmarkCheck, Box, Braces, Brackets, Briefcase, Calendar, CalendarCheck, Car, CaseSensitive, Cast, ChartBar, ChartColumnDecreasing, ChartPie, Check, ChefHat, Chrome, Circle, CircleDollarSign, CirclePower, CircleUser, Clapperboard, ClipboardCopy, Clock, Cloud, Codepen, CodeXml, Coffee, Cog, Cone, Contact, Contrast, Cookie, Copy, Crosshair, CupSoda, Database, Diamond, Disc3, Dog, DollarSign, Download, DraftingCompass, Drill, Droplet, Eye, Facebook, NotebookText, Paperclip, Scroll, Send, StickyNote } from "lucide-react";
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
    configSet: (key: string, value: any) => void;
    configGet: (key: string) => any;
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

    const configSet = (key: string, value: any) => window.api.configSet(key, value);
    const configGet = async (key: string) => { return await window.api.configGet(key) };

    const NoteIcons = {
        Paperclip: <Paperclip />,
        Scroll: <Scroll />,
        NotebookText: <NotebookText />,
        StickyNote: <StickyNote />,
        Send: <Send />,
        Book: <Book />,
        Aperture: <Aperture />,
        Asterisk: <Asterisk />,
        Award: <Award />,
        BadgeCheck: <BadgeCheck />,
        BookHeart: <BookHeart />,
        Braces: <Braces />,
        Brackets: <Brackets />,
        Briefcase: <Briefcase />,
        Bookmark: <Bookmark />,
        BookmarkCheck: <BookmarkCheck />,
        Box: <Box />,
        Calendar: <Calendar />,
        CalendarCheck: <CalendarCheck />,
        Car: <Car />,
        CaseSensitive: <CaseSensitive />,
        Cast: <Cast />,
        Cat: <Cast />,
        ChartBar: <ChartBar />,
        ChartColumnDecreasing: <ChartColumnDecreasing />,
        CharPie: <ChartPie />,
        Check: <Check />,
        ChefHat: <ChefHat />,
        Chrome: <Chrome />,
        Circle: <Circle />,
        CircleDollarSign: <CircleDollarSign />,
        CirclePower: <CirclePower />,
        CircleUser: <CircleUser />,
        Clapperboard: <Clapperboard />,
        Clipboard: <Clipboard />,
        ClipboardCopy: <ClipboardCopy />,
        Clock: <Clock />,
        Cloud: <Cloud />,
        CodeXml: <CodeXml />,
        Codepen: <Codepen />,
        Coffee: <Coffee />,
        Cog: <Cog />,
        Component: <Component />,
        Cone: <Cone />,
        Contact: <Contact />,
        Contrast: <Contrast />,
        Cookie: <Cookie />,
        Copy: <Copy />,
        Crosshair: <Crosshair />,
        CupSoda: <CupSoda />,
        Database: <Database />,
        Diamond: <Diamond />,
        Disc3: <Disc3 />,
        Dog: <Dog />,
        DollarSign: <DollarSign />,
        Download: <Download />,
        DraftingCompass: <DraftingCompass />,
        Droplet: <Droplet />,
        Drill: <Drill />,
        Eye: <Eye />,
        Facebook: <Facebook />,
        File: <File />,
    };

    return (
        <GlobalStateContext.Provider value={{ configGet, configSet, editTab, sidebarCanClose, setSidebarCanClose, editNoteDialogOpen, toggleEditNoteDialog, editorText, insertText, clearEditor, tabs, addTab, removeTab, hasTab, NoteIcons, toggleSettings, settingsOpen, toggleNewNoteDialog, newNoteDialogOpen, openSidebar, closeSidebar, setActiveTab, activeTab }}>
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