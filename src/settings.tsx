import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useGlobalState } from "@/components/globalstate-provider";
import { DialogDescription } from "@radix-ui/react-dialog";
import packageJson from '../package.json';


export default function Settings({ children }: { children: ReactNode }) {
    const { setTheme, theme } = useTheme();
    const { settingsOpen, toggleSettings, configGet, configSet } = useGlobalState();
    
    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }

    async function toggleSpellChecking() {
        const result = await configGet("spellchecking");
        configSet("spellchecking", !result);
    }



    const [defaultValue_darkMode, setDefaultValue_darkMode] = useState<boolean>(false);
    const [defaultValue_spellChecking, setDefaultValue_spellChecking] = useState<boolean>(false);


    // Set default values on mount
    useEffect(() => {
        setDefaultValue_darkMode(theme === "dark");

        async function handle() {
            setDefaultValue_spellChecking(await configGet("spellchecking"));
        }

        handle();
    }, [theme, configGet])

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
                <DialogDescription className="text-xs text-muted-foreground">V{packageJson.version}</DialogDescription>

                <div className="flex items-center justify-between">
                    <Label htmlFor="themeToggle">Dark mode</Label>
                    <Switch defaultChecked={defaultValue_darkMode} name="themeToggle" onClick={toggleTheme}/>
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="spellCheckingToggle">Spell Checking</Label>
                    <Switch defaultChecked={defaultValue_spellChecking} name="spellCheckingToggle" onClick={toggleSpellChecking}/>
                </div>
            </DialogContent>
        </Dialog>
    )
}