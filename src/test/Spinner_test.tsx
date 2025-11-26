import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

export default function Spinner_test() {
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);

            // 예시 async 작업
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success("저장 완료!");
        } catch {
            toast.error("저장 실패!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <main className="p-6">
                <h1 className="text-2xl font-bold mb-4">Async Save Example</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={handleSave}>
                    저장
                </button>
            </main>

            {/* 로딩 블러 overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-xs">
                    <Spinner className="size-8" />
                </div>
            )}
        </div>
    );
}
