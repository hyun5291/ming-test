import React, {useState} from "react";
import {z} from "zod";

// 1. 📝 Zod 스키마 정의
// 단일 'username' 필드에 대한 규칙을 정의합니다.
const UsernameSchema = z.object({
    username: z
        .string({
            message: "사용자 이름은 문자열 형식이어야 합니다.", // 타입 불일치 오류
        })
        .min(3, {
            message: "사용자 이름은 최소 3자 이상이어야 합니다.", // 길이 부족 오류
        })
        .max(15, {
            message: "사용자 이름은 15자를 초과할 수 없습니다.", // 길이 초과 오류
        }),
});

// 스키마로부터 TypeScript 타입 추론
type UsernameInput = z.infer<typeof UsernameSchema>;

// 사용자 정의 에러 타입
interface FieldErrors {
    username?: string;
}

const ZodValidatedInput: React.FC = () => {
    // 2. ⚛️ 상태 관리
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});

    // 3. 🛡️ 검증 로직
    const validateField = (value: string) => {
        // Zod 검증을 위한 객체 생성
        const inputData: UsernameInput = {username: value};

        // .safeParse()를 사용하여 검증 실행
        const result = UsernameSchema.safeParse(inputData);

        if (result.success) {
            // 성공: 에러 상태 초기화
            setErrors({});
            console.log("검증 통과:", result.data);
        } else {
            // 실패: 에러를 구조화하여 상태에 저장
            const formattedErrors = result.error.format();

            // 'username' 필드에 대한 첫 번째 에러 메시지를 추출
            const fieldError = formattedErrors.username?._errors[0];

            setErrors({
                username: fieldError, // 오류 메시지 저장
            });
            console.warn("검증 실패:", formattedErrors);
        }
    };

    // 4. 🔗 입력 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);

        // 입력 시점마다 실시간 검증 실행 (디바운싱을 적용할 수도 있으나, 예제에서는 즉시 실행)
        validateField(value);
    };

    // 5. 🚀 제출 핸들러 (선택적)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 최종 검증
        const finalCheck = UsernameSchema.safeParse({username});

        if (finalCheck.success) {
            alert(`🎉 제출 성공! 사용자 이름: ${finalCheck.data.username}`);
        } else {
            alert("⚠️ 유효성 검사 실패! 오류 메시지를 확인하세요.");
            // 제출 버튼을 눌렀을 때도 에러 상태를 업데이트합니다.
            setErrors({username: finalCheck.error.format().username?._errors[0]});
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Zod React 단일 Input 검증</h2>

            {/* Form 태그와 onSubmit 이벤트 */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        사용자 이름 (3자 ~ 15자)
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="ID를 입력하세요..."
                        className={`mt-1 block w-full border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.username ? "border-red-500" : "border-gray-300"}`}
                        value={username}
                        onChange={handleChange}
                    />

                    {/* 6. 🚨 에러 메시지 표시 */}
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                {/* 제출 버튼은 모든 에러가 없을 때만 활성화 (선택적) */}
                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-150 ${
                        errors.username || username.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={!!errors.username || username.length === 0}
                >
                    제출
                </button>
            </form>
        </div>
    );
};

export default ZodValidatedInput;
