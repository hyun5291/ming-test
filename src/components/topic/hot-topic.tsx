import {UserInfo} from "./user-info";
import {Card} from "../ui";
// import ElectricBorder from "@/components/ui/ElectricBorder";
import type {Topic} from "@/types";
import {useNavigate} from "react-router";

// props 타입 정의
interface HotTopicProps {
    // color: string; // 여기서 color prop 받음
    props?: Topic;
}
function extractTextfromContent(content?: string, maxChars = 100) {
    if (!content) return;
    // console.log("new-topic.jsonpars>", JSON.parse(content));
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    if (!Array.isArray(parsed)) {
        console.warn("전달받은 Blocknote의 content데이터타입이 배열이 아닙니다.");
        return "-----";
    }
    let result = "";

    for (const block of parsed) {
        if (Array.isArray(block.content)) {
            for (const child of block.content) {
                if (child.text) {
                    result += child.text + " "; //child.text가 띄워쓰기없이 쭉 붙여서 출력됨을방지
                    if (result.length >= maxChars) {
                        return result.slice(0, maxChars) + "...";
                    }
                }
            }
        }
    }
    return result;
}
function HotTopic({props}: HotTopicProps) {
    const navigate = useNavigate();
    return (
        // <ElectricBorder color={color} speed={1} chaos={0.5} thickness={3} style={{borderRadius: 16}} className="min-w-[248px] max-w-[248px]">
        // <div className=" p-3 opacity-80">
        <Card className="p-0 gap-4 border-0 bg-transparent min-w-[248px] max-w-[248px]" onClick={() => navigate(`/topic/${props ? props?.id : "user"}`)}>
            <div className="relative">
                <img src="/images/bg-sample.png" alt="@BG-SAMOPLE" className="h-65 rounded-lg" />
                <p className="absolute bottom-4 z-10 px-4 font-semibold text-xl line-clamp-2">
                    {props
                        ? extractTextfromContent(props?.content)
                        : "HOT Topic 제목 조회 테스트 문구입니다. HOT Topic 제목 조회 테스트 문구입니다. HOT Topic 제목 조회 테스트 문구입니다. HOT Topic 제목 조회 테스트 문구입니다. HOT Topic 제목조회 테스트 문구입니다."}
                </p>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent rounded-b-lg"></div>
            </div>
            <UserInfo props={props} />
        </Card>
        // </div>
        // </ElectricBorder>
    );
}

export {HotTopic};
