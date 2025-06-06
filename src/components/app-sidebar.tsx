import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import NewNoteDialog from "@/newnote-dialog"
import Settings from "@/settings"
import { Cog, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import { useGlobalState } from "./globalstate-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { twMerge } from "tailwind-merge"
import { useEffect } from "react"
import { useNote } from "./note-provider"
import EditNoteDialog from "@/editnote-dialog"


export function AppSidebar() {
    const { openSidebar, tabs, addTab, hasTab, configGet, configSet, activeTab, setActiveTab } = useGlobalState();
    const { loadTabs, editNote, saveNote } = useNote();

    // Load Readme note on first startup
    useEffect(() => {
        async function handle() {
            const result = await configGet("firststartup");

            if (!result) {
              addTab({ name: "Readme", icon: "Paperclip" });
              saveNote("Readme", "Thank's for installing FLuxnotes. Create your first note using the plus button\nin the sidebar or using ctrl+n");
              editNote("Readme", "Readme", "Paperclip");
              
              configSet("firststartup", true);
            }
        }

        handle();
    }, []);


    // Load all tabs on startup
    useEffect(() => {
      async function handle() {
          const result = await loadTabs();

          Object.entries(result).forEach(([name, { icon }]) => {
              if (!hasTab(name)) {
                  addTab({ name, icon });
              }
          });

          // Open last active tab
          const lastTab = await configGet("lastactivetab");
          setActiveTab(lastTab ?? '');
      }

      handle();
    }, [])


    // Save last open tab to config
    useEffect(() => {
        // window.api.onGetLastActiveTab(() => {
        //     console.log("received");
        //     window.api.sendLastActiveTab(activeTab);
        // });

        if (activeTab !== '') { configSet("lastactivetab", activeTab) };

    }, [activeTab]);

    return (
      <Sidebar collapsible="icon" onMouseEnter={openSidebar}>
        <SidebarHeader className="p-0 m-0">
          <SidebarGroup>
            <SidebarGroupLabel>Notes</SidebarGroupLabel>
              <NewNoteDialog>
                <SidebarGroupAction title="New note">
                  <Plus />
                </SidebarGroupAction>
              </NewNoteDialog>
          </SidebarGroup>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((tab) => {
                  return (
                    <SidebarTab tab={tab} key={tab.name}/>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>


        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Settings>
                <SidebarMenuButton>
                  <Cog/>
                  <span>Settings</span>
                </SidebarMenuButton>
              </Settings>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }



type TabType = {
    name: string;
    icon: string;
}

function SidebarTab({ tab }: { tab:  TabType}) {
  const { NoteIcons, setActiveTab, activeTab, editorText } = useGlobalState();
  const { deleteTab, saveNote } = useNote();
  const activeTabStyle = activeTab === tab.name ? "bg-sidebar-accent" : "bg-transparent"


  // Save current tab before switching to another
  function switchTab() {
    if (activeTab !== '' && editorText?.trim() !== '') {
      saveNote(activeTab, editorText);
    }
    setActiveTab(tab.name);
  }

  return (
      <SidebarMenuItem>
          <SidebarMenuButton
              variant={"outline"}
              onClick={switchTab}
              className={twMerge("transition duration-100", activeTabStyle)}>
              {NoteIcons[tab.icon]}
              <span>{tab.name}</span>
          </SidebarMenuButton>

          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                      <MoreHorizontal />
                  </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                  <EditNoteDialog tab={tab}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil />
                          <span>edit</span>
                      </DropdownMenuItem>
                  </EditNoteDialog>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem variant="destructive" onClick={() => deleteTab(tab.name)}>
                      <Trash />
                      <span>remove</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
      </SidebarMenuItem>
  );
}