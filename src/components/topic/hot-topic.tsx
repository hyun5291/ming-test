import {UserInfo} from "./user-info";
import {Card} from "../ui";
import ElectricBorder from "@/components/ui/ElectricBorder";

// props 타입 정의
interface HotTopicProps {
    color: string; // 여기서 color prop 받음
}

function HotTopic({color}: HotTopicProps) {
    return (
        <ElectricBorder color={color} speed={1} chaos={0.2} thickness={3} style={{borderRadius: 16}} className="min-w-[248px] max-w-[248px]">
            <div className=" p-3 opacity-80">
                <Card className="p-0 gap-4 border-0 bg-transparent">
                    <div className="relative">
                        <img src="/images/bg-sample.png" alt="@BG-SAMOPLE" className="h-65 rounded-lg" />
                        <p className="absolute bottom-4 z-10 px-4 font-semibold text-xl line-clamp-2">
                            NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목
                            조회 테스트 문구입니다.
                        </p>
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent rounded-b-lg"></div>
                    </div>
                    <UserInfo />
                </Card>
            </div>
        </ElectricBorder>
    );
}

export {HotTopic};
