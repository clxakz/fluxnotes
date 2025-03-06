import Titlebar from "./components/titlebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect } from "react";
import { useGlobalState } from "@/components/globalstate-provider";
import { useNote } from "./components/note-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { toggleSettings, settingsOpen, toggleNewNoteDialog, newNoteDialogOpen, closeSidebar, editorText, activeTab } = useGlobalState();
    const { saveNote } = useNote();

    // Handle global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Open settings with ctrl+,
            if (event.ctrlKey && event.key === "," && !newNoteDialogOpen) {
                event.preventDefault();
                toggleSettings();
            }

            // Open new note dialog with ctrl+n
            else if (event.ctrlKey && event.key === "n" && !settingsOpen) {
                event.preventDefault();
                toggleNewNoteDialog();
            }

            // Save note with ctrl+s
            else if (event.ctrlKey && event.key === 's' && activeTab !== '') {
                saveNote(activeTab, editorText);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [settingsOpen, newNoteDialogOpen, activeTab, editorText]);



    return (
        <div className="grid grid-rows-[auto_1fr] w-screen h-screen">
            <Titlebar />

            <div className="relative">
                <AppSidebar />

                <main onMouseEnter={closeSidebar} className="absolute inset-0 pl-12">{children}</main>
            </div>
        </div>
    );
}
