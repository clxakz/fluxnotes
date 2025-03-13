import { useEffect, useRef } from "react";
import { useGlobalState } from "./components/globalstate-provider";
import { useNote } from "./components/note-provider";

function Editor() {
  const { editorText, insertText, activeTab, configGet } = useGlobalState();
  const { loadText } = useNote();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);


   // Change editor text when active tab changes
   useEffect(() => {
       if (activeTab !== "") {
           async function handle() {
               const result = await loadText(activeTab);
               insertText(result ?? "");
           }

           handle();
       }
   }, [activeTab]);


   // Handle spell checking from config
   useEffect(() => {
       async function handle() {
           const result = await configGet("spellchecking");
           if (textAreaRef.current) {
               textAreaRef.current.spellcheck = result;
           }
       }

       handle();
   }, [configGet]);

  return (
    <div className="w-full h-full overflow-hidden pl-1">
      <textarea ref={textAreaRef} value={editorText} onChange={(e) => insertText(e.target.value)} wrap="off" className="h-full w-full resize-none outline-none border-none"/>
    </div>
  );
}

export default Editor;
