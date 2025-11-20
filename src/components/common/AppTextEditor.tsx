import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

function AppTextEditor() {
    // Creates a new editor instance.
    const editor = useCreateBlockNote();
    return (
        <BlockNoteView
            editor={editor}
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

export { AppTextEditor };
