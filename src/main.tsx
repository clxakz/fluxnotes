// import React from 'react'
import ReactDOM from 'react-dom/client'
import Editor from './editor.tsx'
import './index.css'
import Layout from './layout.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import GlobalStateProvider from '@/components/globalstate-provider'
import NoteProvider from '@/components/note-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <SidebarProvider>
            <GlobalStateProvider>
                <NoteProvider>
                    <Layout>
                        <Editor />
                    </Layout>
                </NoteProvider> 
            </GlobalStateProvider>
        </SidebarProvider>
    </ThemeProvider>
);
