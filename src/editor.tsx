import { useEffect } from "react";
import { useGlobalState } from "./components/globalstate-provider";
import { useNote } from "./components/note-provider";

function Editor() {
  const { editorText, insertText, activeTab } = useGlobalState();
  const { loadText } = useNote();


   // Change editor text when active tab changes
   useEffect(() => {
    if (activeTab !== "") {
        async function handle() {
            const result = await loadText(activeTab);
            insertText(result ?? '');
        }

        handle();
    }
}, [activeTab])

  return (
    <div className="w-full h-full overflow-hidden pl-1">
      <textarea value={editorText} onChange={(e) => insertText(e.currentTarget.value)} wrap="off" className="h-full w-full resize-none outline-none border-none"/>
    </div>
  );
}

export default Editor;
