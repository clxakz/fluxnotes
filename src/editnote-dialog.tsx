import { cloneElement, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useGlobalState } from "./components/globalstate-provider";
import { useNote } from "./components/note-provider";

const defaultIcon: string = "Paperclip";
export default function EditNoteDialog({ children, tab }: { children: ReactNode, tab: {name: string, icon: string} }) {
    const { editNoteDialogOpen, toggleEditNoteDialog, NoteIcons, hasTab, setActiveTab, editTab } = useGlobalState();
    const noteIcons = Object.keys(NoteIcons);
    const { editNote } = useNote();

    const inputRef = useRef<HTMLInputElement>(null);
    
    
    // Handle editing a note
    const [newNoteName, setNewNoteName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [newNoteIcon, setNewNoteIcon] = useState<string>(defaultIcon);

    function onSave() {
        if (newNoteName.trim() !== '' && !hasTab(newNoteName)) {
            editNote(tab.name, newNoteName, newNoteIcon);
            editTab(tab.name, newNoteName, newNoteIcon);
            toggleEditNoteDialog();
            setActiveTab(newNoteName);
        } else if (hasTab(newNoteName)) {
            setErrorMessage(`Note ${newNoteName} already exists`);
        } else {
            setErrorMessage("A note name cannot be empty");
        }
    }


    useEffect(() => {
        // Reset values on dialog close
        if (!editNoteDialogOpen) { 
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
            // Save a note when enter is pressed
            if (event.key === "Enter") {
                event.preventDefault();
                onSave();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editNoteDialogOpen, newNoteName])

    return (
        <Dialog open={editNoteDialogOpen} onOpenChange={toggleEditNoteDialog}>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>

            <DialogContent>
                <DialogDescription className="sr-only">Edit note dialog</DialogDescription>
                {errorMessage && <DialogDescription className="text-red-500">{errorMessage}</DialogDescription>}

                <DialogHeader>
                    <DialogTitle>Editing { tab.name }</DialogTitle>
                </DialogHeader>

                <div className="flex gap-1 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"outline"}>
                                { newNoteIcon === '' ? NoteIcons[tab.icon] : NoteIcons[newNoteIcon]}
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

                    <Input ref={inputRef} className={errorMessage === undefined ? "" :  "border-red-500"} onChange={(e) => setNewNoteName(e.currentTarget.value)} placeholder={tab.name}/>
                </div>

                <DialogFooter>
                    <Button onClick={onSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}