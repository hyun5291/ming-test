import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {ko} from "@blocknote/core/locales";
import type {Block, BlockNoteEditor} from "@blocknote/core";

interface Props {
    props: Block[];
    onSetContent: (param: Block[]) => void;
}
// function AppTextEditor({p_editor}: P_type) {
function AppTextEditor({props, onSetContent}: Props) {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        dictionary: ko,
    });

    return <BlockNoteView editor={editor} className="bg-input/30 min-h-80" onChange={() => onSetContent(editor.document)} />;
}

export {AppTextEditor};
