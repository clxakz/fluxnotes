import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useGlobalState } from "@/components/globalstate-provider";
import { DialogDescription } from "@radix-ui/react-dialog";


export default function Settings({ children }: { children: ReactNode }) {
    const { setTheme, theme } = useTheme();
    const { settingsOpen, toggleSettings } = useGlobalState();
    
    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }


    const [defaultValue_darkMode, setDefaultValue_darkMode] = useState<boolean>(false);

    // Set default values on mount
    useEffect(() => {
        setDefaultValue_darkMode(theme === "dark");
    }, [theme])

    return (
        <Dialog open={settingsOpen} onOpenChange={toggleSettings}>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>

            <DialogContent>
                <DialogDescription className="sr-only">Settings dialog</DialogDescription>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-between">
                    <Label htmlFor="themeToggle">Dark mode</Label>
                    <Switch defaultChecked={defaultValue_darkMode} name="themeToggle" onClick={toggleTheme}/>
                </div>
            </DialogContent>
        </Dialog>
    )
}