import {UserInfo} from "./user-info";
import {Card, Separator} from "../ui";
import {CaseSensitive, ChartNoAxesColumnIncreasing, Heart, MessageCircleMore} from "lucide-react";
import ElectricBorder from "../ui/ElectricBorder";
import {useNavigate} from "react-router";

interface Topic {
    id: number;
    created_at: Date;
    updated_at: Date;
    title: string;
    content: string;
    category: string;
    thumbnail: string;
    status: string;
    author: string;
}

interface Props {
    props: Topic;
}
function extractTextfromContent(content: string, maxChars = 100) {
    console.log("jsonpars>", JSON.parse(content));
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

function NewTopic({props}: Props) {
    const navigate = useNavigate();
    return (
        <ElectricBorder color="#7df9ff" speed={1} chaos={0.5} thickness={2} style={{borderRadius: 16}} className="min-w-[520px] max-w-[520px]">
            <div className="p-3 opacity-80">
                <Card className="p-4 gap-4" onClick={() => navigate(`/topic/${props.id}`)}>
                    <div className="h-fit flex items-center justify-between gap-4">
                        <div className="h-full flex flex-col justify-between">
                            {/* 제목 */}
                            <div className="flex flex-col">
                                <CaseSensitive size={16} className="text-neutral-500" />
                                <p className="font-semibold text-base line-clamp-2">{props.title}</p>
                            </div>
                            {/* 본문 */}
                            <p className="text-neutral-500 line-clamp-3">{extractTextfromContent(props.content)}</p>
                        </div>
                        {/* 썸넬 */}
                        <div className="w-35 min-w-35 h-35 bg-accent rounded-md">
                            {/* <img src="/vite.svg" alt="@SAMPLE_IMAGE" className="w-35 min-w-35 bg-accent rounded-md" /> */}
                            <img src={props.thumbnail} alt="@SAMPLE_IMAGE" className="w-full h-full bg-accent rounded-md object-cover" />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-end justify-between">
                        <UserInfo />
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <ChartNoAxesColumnIncreasing size={14} />
                                    <p>24</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircleMore size={14} />
                                    <p>0</p>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-3!" />
                            <div className="flex items-center gap-1">
                                <Heart size={14} className="text-rose-500" />
                                <p>1</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </ElectricBorder>
    );
}

export {NewTopic};
