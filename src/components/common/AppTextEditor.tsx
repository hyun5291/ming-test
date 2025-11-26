import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {ko} from "@blocknote/core/locales";
import type {Block} from "@blocknote/core";
import {useEffect, useRef} from "react";

interface Props {
    props: Block[];
    onSetContent?: (params: Block[]) => void;
    readonly?: boolean;
}
function AppTextEditor({props, readonly, onSetContent}: Props) {
    // Creates a new editor instance.

    const editor = useCreateBlockNote({
        dictionary: ko,
    });

    const initialLoaded = useRef(false);
    useEffect(() => {
        // 첫 로딩 시에만 replaceBlocks 사용
        if (!initialLoaded.current && props && props.length > 0) {
            editor.replaceBlocks(editor.document, props);
            initialLoaded.current = true;
        }
    }, [props, editor]);

    return (
        <BlockNoteView
            className="bg-input/30 min-h-80"
            editor={editor}
            editable={!readonly}
            onChange={() => {
                if (!readonly) {
                    //!readonly =>생성페이지에서접근
                    onSetContent?.(editor.document);
                }
            }}
        />
    );
}

export {AppTextEditor};
