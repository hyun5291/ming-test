import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {ko} from "@blocknote/core/locales";
import type {Block} from "@blocknote/core";
import {useEffect} from "react";

interface Props {
    props: Block[];
    onSetContent?: (params: Block[]) => void;
    readonly?: boolean;
}

function AppTextEditor({props, readonly, onSetContent}: Props) {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        dictionary: ko,
        initialContent: props && props.length > 0 ? props : undefined,
    });

    useEffect(() => {
        // [핵심 수정 부분]
        // props가 유효하고, 실제로 내용이 있을 때만 replaceBlocks 호출
        if (props && props.length > 0) {
            const currentDocument = JSON.stringify(editor.document);
            const nextDocument = JSON.stringify(props);

            // editor.replaceBlocks를 호출하기 전에
            // 현재 에디터 문서가 props와 다를 경우에만 실행하여 불필요한 리렌더링을 방지할 수도 있습니다.
            // 하지만 간단하게는 다음과 같이 처리합니다.
            if (currentDocument !== nextDocument) {
                editor.replaceBlocks(editor.document, props);
            }
        }
    }, [props, editor]); // 👈 props와 editor를 의존성 배열에 추가
    // editor는 useCreateBlockNote()로 생성되어 변경되지 않지만,
    // ESLint 규칙을 위해 포함하거나, useMemo로 감싸는 것이 좋습니다.
    // 여기서는 props가 변경될 때마다 실행되도록 명시적으로 [props]를 넣는 것이 중요합니다.

    // Renders the editor instance using a React component.
    return (
        <BlockNoteView
            className="bg-input/30"
            editor={editor}
            editable={!readonly}
            onChange={() => {
                if (!readonly) {
                    // !readonly => 생성 페이지에서 접근
                    onSetContent?.(editor.document);
                }
            }}
        />
    );
}

export {AppTextEditor};
