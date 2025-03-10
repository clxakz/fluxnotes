import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./index.css";
import { Loader } from "lucide-react";

const NoteProvider = lazy(() => import("./components/note-provider"));
const GlobalStateProvider = lazy(() => import("./components/globalstate-provider"));
const Editor = lazy(() => import("./editor.tsx"));
const Layout = lazy(() => import("./layout.tsx"));

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <SidebarProvider>
            <Suspense
                fallback={
                    <div className="fixed inset-0 flex items-center justify-center">
                        <Loader className="animate-spin" size={20} />
                    </div>
                }>
                <GlobalStateProvider>
                    <NoteProvider>
                        <Layout>
                            <Editor />
                        </Layout>
                    </NoteProvider>
                </GlobalStateProvider>
            </Suspense>
        </SidebarProvider>
    </ThemeProvider>
);
