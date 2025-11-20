import {UserInfo} from "./user-info";
import {Card, Separator} from "../ui";
import {CaseSensitive, ChartNoAxesColumnIncreasing, Heart, MessageCircleMore} from "lucide-react";
import ElectricBorder from "../ui/ElectricBorder";

function NewTopic() {
    return (
        <ElectricBorder color="#7df9ff" speed={1} chaos={0.5} thickness={2} style={{borderRadius: 16}} className="min-w-[520px] max-w-[520px]">
            <div className="p-3">
                <Card className="p-4 gap-4">
                    <div className="h-fit flex items-center gap-4">
                        <div className="h-full flex flex-col justify-between">
                            {/* 제목 */}
                            <div className="flex flex-col">
                                <CaseSensitive size={16} className="text-neutral-500" />
                                <p className="font-semibold text-base line-clamp-2">
                                    NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW
                                    Topic 제목 조회 테스트 문구입니다.
                                </p>
                            </div>
                            {/* 본문 */}
                            <p className="text-neutral-500 line-clamp-3">
                                NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic
                                본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다.
                            </p>
                        </div>
                        <div className="w-35 min-w-35 bg-accent rounded-md p-4">
                            {/* <img src="/vite.svg" alt="@SAMPLE_IMAGE" className="w-35 min-w-35 bg-accent rounded-md" /> */}
                            <img src="/vite.svg" alt="@SAMPLE_IMAGE" className="w-full bg-accent rounded-md" />
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
