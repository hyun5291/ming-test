import {UserInfo} from "./user-info";
import {Card, Separator} from "../ui";
import {CaseSensitive, ChartNoAxesColumnIncreasing, Heart, MessageCircleMore} from "lucide-react";
// import ElectricBorder from "../ui/ElectricBorder";
import {useNavigate} from "react-router";
import type {Topic} from "@/types";

interface Props {
    props?: Topic;
    // color?: string;
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

function NewTopic({props}: Props) {
    const navigate = useNavigate();
    return (
        // <ElectricBorder color={color} speed={1} chaos={0.2} thickness={2} style={{borderRadius: 16}} className="min-w-[520px] max-w-[520px]">
        // <div className="p-3 opacity-80 ">
        <Card className="p-4 gap-4 min-w-[520px] max-w-[520px]" onClick={() => navigate(`/topic/${props ? props?.id : "user"}`)}>
            <div className="h-fit flex items-center justify-between gap-4">
                <div className="h-full flex flex-col justify-between">
                    {/* 제목 */}
                    <div className="flex flex-col">
                        <CaseSensitive size={16} className="text-neutral-500" />
                        <p className="font-semibold text-base line-clamp-2">
                            {props ? props?.title : "NEW Topic 제목 문구입니다.NEW Topic 제목 문구입니다.NEW Topic 제목 문구입니다.NEW Topic 제목 문구입니다.NEW Topic 제목 문구입니다."}
                        </p>
                    </div>
                    {/* 본문 */}
                    <p className="text-neutral-500 line-clamp-3">
                        {props
                            ? extractTextfromContent(props?.content)
                            : "NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다.NEW Topic 컨텐츠 문구입니다."}
                    </p>
                </div>
                {/* 썸넬 */}
                <div className="w-35 min-w-35 h-35 bg-accent rounded-md">
                    {/* <img src="/vite.svg" alt="@SAMPLE_IMAGE" className="w-35 min-w-35 bg-accent rounded-md" /> */}
                    <img src={props ? props?.thumbnail : "/vite.svg"} alt="@SAMPLE_IMAGE" className="w-full h-full bg-accent rounded-md object-cover" />
                </div>
            </div>
            <Separator />
            <div className="flex items-end justify-between">
                <UserInfo props={props} />
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <ChartNoAxesColumnIncreasing size={14} />
                            <p>{props?.viewCounts === null ? 0 : props?.viewCounts}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircleMore size={14} />
                            <p>{props?.commentCounts === null ? 0 : props?.commentCounts}</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-3!" />
                    <div className="flex items-center gap-1">
                        <Heart size={14} className="text-rose-500" />
                        <p>{props?.likeCounts === null ? 0 : props?.likeCounts}</p>
                    </div>
                </div>
            </div>
        </Card>
        // </div>
        // </ElectricBorder>
    );
}

export {NewTopic};
