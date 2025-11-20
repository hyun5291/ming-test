import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";

function App() {
    const [topics, setTopics] = useState<any[]>([]);

    async function getTodos() {
        try {
            const { data, error } = await supabase.from("topics").select("*");

            if (error) {
                return [];
            }

            console.log("data", data);
            return data ?? [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getTodos();
            setTopics(result);
        }
        fetchData();
    }, []);

    const formatAbsoluteAndRelative = (isoString: string) => {
        // KST 기준으로 변환
        const dt = DateTime.fromISO(isoString, { zone: "utc" }).setZone("Asia/Seoul");

        // 절대시간 포맷
        const absolute = dt.toFormat("yyyy-MM-dd HH:mm:ss");

        // 현재 시간
        const now = DateTime.now().setZone("Asia/Seoul");

        // 시간과 분 차이 계산
        const diff = now.diff(dt, ["days", "hours", "minutes"]);
        const days = Math.floor(diff.days);
        const hours = Math.floor(diff.hours);
        const minutes = Math.floor(diff.minutes);

        // 상대시간
        const relative = dt.toRelative({ locale: "ko" }); // ko,ja,fr,en // ex ${relative} : (1일 전)  //(47시간59분전까지 1일 전)

        return `${absolute} (${days}일 ${hours}시간 ${minutes}분 전)`;
    };

    const formatAbsoluteAndRelative_days = (isoString: string) => {
        // UTC → KST 변환
        const dt = DateTime.fromISO(isoString, { zone: "utc" }).setZone("Asia/Seoul");

        // 절대시간 포맷
        const absolute = dt.toFormat("yyyy-MM-dd HH:mm:ss");

        // 상대시간
        const relative = dt.toRelative({ locale: "ko" }); // ko,ja,fr,en

        return `${absolute} (${relative})`;
    };

    return (
        <div>
            <h1>데이타받았나</h1>
            <div>
                {topics.map((item, idx) => (
                    <div key={idx}>
                        <div>category:{item.category}</div>
                        <div>commentCounts:{item.commentCounts}</div>
                        <div>created_at:{item.created_at}</div>
                        <div>created_at(edited):{formatAbsoluteAndRelative(item.created_at)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
