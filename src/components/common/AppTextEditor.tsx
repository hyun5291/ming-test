import type {BlockNoteEditor} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {BlockNoteView} from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import {useEffect} from "react";
interface P_type {
    p_editor: BlockNoteEditor;
}

function AppTextEditor({p_editor}: P_type) {
    // Creates a new editor instance.
    // const editor = useCreateBlockNote();.

    return (
        <BlockNoteView
            editor={p_editor}
            shadCNComponents={
                {
                    // Pass modified ShadCN components from your project here.
                    // Otherwise, the default ShadCN components will be used.
                }
            }
            className="bg-input/30 min-h-80"
        />
    );
}

export {AppTextEditor};
