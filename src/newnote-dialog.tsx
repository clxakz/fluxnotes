import { cloneElement, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/components/globalstate-provider";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNote } from "@/components/note-provider";

const defaultIcon: string = "Paperclip";
export default function NewNoteDialog({ children }: { children: ReactNode }) {
    const { newNoteDialogOpen, toggleNewNoteDialog, NoteIcons, hasTab, setActiveTab, activeTab, editorText } = useGlobalState();
    const { createNote, saveNote } = useNote();
    const noteIcons = Object.keys(NoteIcons);

    const inputRef = useRef<HTMLInputElement>(null);


    // Handle creating a new note
    const [newNoteName, setNewNoteName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [newNoteIcon, setNewNoteIcon] = useState<string>(defaultIcon);

    function onCreate() {
        if (newNoteName.trim() !== '' && !hasTab(newNoteName)) {
            createNote(newNoteName, newNoteIcon);
            
            // Save current tab before switching to another <--- NOT WORKING FIX!!
            // if (activeTab !== '' && editorText?.trim() !== '') {
            //     saveNote(activeTab, editorText);
            // }

            toggleNewNoteDialog();
            setActiveTab(newNoteName);
        } else if (hasTab(newNoteName)) {
            setErrorMessage(`Note ${newNoteName} already exists`);
        } else {
            setErrorMessage("A note name cannot be empty");
        }
    } 


    useEffect(() => {
        // Reset values on dialog close
        if (!newNoteDialogOpen) { 
            setErrorMessage(undefined);
            setNewNoteIcon(defaultIcon);
            setNewNoteName('');
        }

        // Focus input when dialog opens
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);

        // Handle keyboard shortcuts within new note dialog
        const handleKeyDown = (event: KeyboardEvent) => {
            // Create a note when enter is pressed
            if (event.key === "Enter") {
                event.preventDefault();
                onCreate();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [newNoteDialogOpen, newNoteName])


    return (
        <Dialog open={newNoteDialogOpen} onOpenChange={toggleNewNoteDialog}>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>

            <DialogContent>
                <DialogDescription className="sr-only">New note creation dialog</DialogDescription>
                {errorMessage && <DialogDescription className="text-red-500">{errorMessage}</DialogDescription>}

                <DialogHeader>
                    <DialogTitle>Create a new note</DialogTitle>
                </DialogHeader>

                <div className="flex gap-1 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"outline"}>
                                {NoteIcons[newNoteIcon] ?? <ChevronDown/>}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Select an icon</DropdownMenuLabel>

                            <DropdownMenuGroup>
                                <div className="grid grid-cols-6 gap-1">
                                    {noteIcons.map((iconName: string) => {
                                        const icon = NoteIcons[iconName];

                                        return (
                                            <DropdownMenuItem key={iconName} onClick={() => setNewNoteIcon(iconName)}>
                                                {cloneElement(icon as ReactElement, { className: "size-5" })}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </div>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Input ref={inputRef} className={errorMessage === undefined ? "" :  "border-red-500"} onChange={(e) => setNewNoteName(e.currentTarget.value)} placeholder="name"/>
                </div>

                <DialogFooter>
                    <Button onClick={onCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}