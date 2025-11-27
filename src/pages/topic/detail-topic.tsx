import {UserInfo} from "@/components/topic";
import {
    Button,
    Separator,
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    Spinner,
    AlertDialogCancel,
} from "@/components/ui";
import {useAuthStore} from "@/store/useAuthStore";

import supabase from "@/utils/supabase";
import {ArrowLeft, ChartNoAxesColumnIncreasing, Edit, Heart, MessageCircleMore, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import {AppTextEditor} from "@/components/common";
import {toast} from "sonner";
import type {Topic} from "@/types";

// 우리가 필요한 정보
// - title: 제목
// - created_at: 작성일
// - content: 내용
// - thumbnail: 썸네일
// - category: 카테고리

function categoryChange(val: string) {
    let res = "";
    val === "humidity" ? (res = "인문학") : "";
    val === "start-up" ? (res = "스타트업") : "";
    val === "programming" ? (res = "IT·프로그래밍") : "";
    val === "planning" ? (res = "서비스·전략 기획") : "";
    val === "marketing" ? (res = "마케팅") : "";
    val === "design" ? (res = "디자인·일러스트") : "";
    val === "self-development" ? (res = "자기계발") : "";
    return res;
}

function DetailTopic() {
    const user = useAuthStore((s) => s.user); //스토어
    const navigate = useNavigate();
    const {topic_id} = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(false);

    // 불러오기
    useEffect(() => {
        async function getTopic() {
            try {
                setLoading(true);
                const {data, error} = await supabase.from("topics").select("*").eq("id", topic_id);

                if (error) {
                    console.error("조회 실패:", error);
                    return;
                }

                if (data && data.length > 0) {
                    setTopic(data[0]);
                }
            } catch (err) {
                console.error("예외 발생:", err);
            } finally {
                setLoading(false);
            }
        }
        getTopic();
    }, [topic_id]);

    // 삭제
    async function deleteTopic() {
        const {error} = await supabase.from("topics").delete().eq("id", topic_id);
        if (error) {
            console.error("삭제 오류:", error);
            return;
        }
        toast.warning("삭제완료");
        navigate("/"); // 삭제후홈
    }

    return (
        <main className="w-full max-w-[1328px] pb-6">
            {/* 로딩 */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-xs">
                    <Spinner className="size-8" />
                </div>
            )}
            <div className="relative h-100 bg-cover bg-position-[50%_50%]" style={{backgroundImage: `url(${topic?.thumbnail})`}}>
                {/* 배경 어둡게 */}
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-20 flex flex-col gap-6">
                    <div className="fixed top-14 z-30 flex items-center gap-2 mt-6 ">
                        {/* 뒤로 가기 */}
                        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="cursor-pointer">
                            <ArrowLeft />
                        </Button>
                        {user?.id && user.id === topic?.author ? (
                            <>
                                <Button variant="outline" size="icon" onClick={() => navigate(`/topic/${topic_id}/edit`)} className="cursor-pointer">
                                    <Edit />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" className="bg-red-900/50! cursor-pointer">
                                            <Trash2 />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="sm:max-w-[400px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>삭제하시겠습니까?</AlertDialogTitle>
                                            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter className="gap-2">
                                            <AlertDialogCancel>아니오</AlertDialogCancel>
                                            <Button variant="destructive" onClick={deleteTopic}>
                                                예
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* 제목 영역 */}
                    <div className="flex flex-col items-center gap-6 ">
                        <span>{topic && categoryChange(topic.category)}</span>
                        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{topic?.title}</h1>
                        <Separator className="w-6! bg-white" />
                        <span>{topic && new Date(topic.updated_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                </div>
                {/* 좌, 우, 하단 그라데이션 */}
                <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-l from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            {/* 컨텐*/}
            {/* <div className="mt-1 bg-input/30 p-3 rounded-md">{topic && extractTextfromContent(topic.content)}</div> */}
            {/* <div className="mt-1 bg-input/30 p-3 rounded-md bn-renderer" dangerouslySetInnerHTML={{__html: html}} /> */}
            {/* <div className="mt-1 bg-input/30 p-3 rounded-md"></div> */}
            {/* <AppTextEditor props={topic?.content} readonly={true}/> */}

            <div className="mt-1 rounded-md">{topic && <AppTextEditor props={JSON.parse(topic.content)} readonly={true} />}</div>

            <div className="mt-2 bg-input/30 p-3 rounded-md flex items-end justify-between">
                <UserInfo props={topic} />
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <ChartNoAxesColumnIncreasing size={14} />
                            <p>{topic?.viewCounts === null ? 0 : topic?.viewCounts}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircleMore size={14} />
                            <p>{topic?.commentCounts === null ? 0 : topic?.commentCounts}</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-3!" />
                    <div className="flex items-center gap-1 cursor-pointer">
                        <Heart size={14} className="text-rose-500" />
                        <p>{topic?.likeCounts === null ? 0 : topic?.likeCounts}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DetailTopic;
