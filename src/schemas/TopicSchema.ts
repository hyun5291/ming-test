// src/schemas/TopicSchema.ts (검증 완료)
import {z} from "zod";
import type {Block} from "@blocknote/core";

// 폼 데이터 구조에 대한 Zod 스키마 정의
export const TopicSchema = z.object({
    // 1. 제목 (Title): 필수, 최소 5자
    title: z.string().min(5, {message: "제목은 최소 5자 이상 입력해야 합니다."}),

    // 2. 카테고리 (Category): 필수
    category: z.string().min(1, {message: "카테고리를 선택해주세요."}),

    // 3. 본문 (Content): BlockNote 출력 JSON.
    content: z.array(z.any()).refine(
        (val: Block[]) => {
            // 내용이 실제로 존재하는지 확인하는 사용자 정의 로직 (배열 길이가 0이 아닌지)
            return val && val.length > 0;
        },
        {
            message: "본문 내용을 입력해주세요.",
        }
    ),

    // 4. 썸네일 (Thumbnail): File 객체, URL string, 또는 null
    // ⭐️ 오류 수정: z.union의 옵션 객체에서 'required_error'를 제거했습니다.
    // z.union은 여러 타입 중 하나를 검증하며, 필수 여부는 외부에서 .nullable()/.optional()로 정의합니다.
    thumbnail: z
        .union(
            [
                // 유효한 타입들
                z.instanceof(File),
                z.string().url("유효한 썸네일 URL이 아닙니다."),
                z.literal(null),
            ],
            {
                // union 검사 자체에 실패했을 때의 메시지 (입력값이 File, string, null 모두 아닐 때)
                message: "썸네일은 유효한 파일, URL 또는 null 형태여야 합니다.",
            }
        )
        .nullable(), // useForm의 초기값 null을 허용
});

export type TopicFormValues = z.infer<typeof TopicSchema>;
