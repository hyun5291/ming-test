import {ChartNoAxesCombined, ChevronDown, CodeXml, DraftingCompass, Footprints, Goal, Icon, Lightbulb, List, PencilLine, Rocket, Search} from "lucide-react";
import {Button, Input, Spinner} from "./components/ui";
import {HotTopic, NewTopic} from "./components/topic";
import {useNavigate} from "react-router";
import {GradientText} from "./components/ui/shadcn-io/gradient-text";
import {toast} from "sonner";
import {useAuthStore} from "./store/useAuthStore";
import supabase from "./utils/supabase";
import {useState} from "react";

const CATEGORIES = [
    // { icon: List, label: "전체" },
    {icon: Lightbulb, label: "인문학"},
    {icon: Rocket, label: "스타트업"},
    {icon: CodeXml, label: "IT·프로그래밍"},
    {icon: Goal, label: "서비스·전략 기획"},
    {icon: ChartNoAxesCombined, label: "마케팅"},
    {icon: DraftingCompass, label: "디자인·일러스트"},
    {icon: Footprints, label: "자기계발"},
];

function App() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    console.log("App>", user);

    const moveToPage = async () => {
        if (!user) {
            toast.warning("토픽 작성은 로그인 후 이용 가능합니다.");
            return;
        }
        try {
            //Supabase 새로운 세션 요청
            const {data, error} = await supabase
                .from("topics")
                .insert([{author: user.id}])
                .select();

            if (error || !data) {
                console.error("저장실패", error);
                toast.warning("저장실패");
                return;
            }
            // console.log(data);
            console.log(data[0]);
            // return;
            if (data) {
                setLoading(false);
                toast.warning("토픽작성준비완료.");
                navigate(`/topic/${data[0].id}/create`);
            }
        } catch (err) {
            console.error("예외 발생:", err);
            toast.warning("예외 발생>" + err);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1328px] h-full flex items-start py-6 gap-6">
            {/* 로딩 블러 overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-xs">
                    <Spinner className="size-8" />
                </div>
            )}
            <aside className="sticky top-18 w-60 min-w-60 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold">카테고리</p>
                    <ChevronDown />
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="flex justify-start text-white bg-transparent hover:bg-card hover:text-white hover:pl-6 duration-500 border-2">
                        <List />
                        전체
                    </Button>
                    {CATEGORIES.map((category, idx) => {
                        const IconComponent = category.icon;
                        return (
                            <Button key={idx} className="flex justify-start text-neutral-500 bg-transparent hover:bg-card hover:text-white hover:pl-6 duration-500">
                                <IconComponent />
                                <GradientText text={category.label} gradient="linear-gradient(90deg,#ffffff 0%, #e68ee3 50%, #e0c3fc 100%)" className="font-bold" />
                            </Button>
                        );
                    })}
                </div>
            </aside>
            <div className="min-h-screen flex-1 flex flex-col gap-12">
                <section className="w-full flex flex-col items-center justify-center gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src="/gifs/heart.gif" alt="@HEART_GIFS" className="w-8" />
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">지식과 인사이트를 모아,</h3>
                        </div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">토픽으로 깊이 있게 나누세요!</h3>
                    </div>
                    {/* 검색창 */}
                    <div className="w-full max-w-lg flex items-center gap-2 border py-2 pl-4 pr-3 rounded-full">
                        <Search size={24} className="text-neutral-500 -mr-2" />
                        <Input placeholder="관심 있는 클래스, 토픽 주제를 검색하세요." className="border-none bg-transparent! focus-visible:ring-0 placeholder:text-base" />
                        <Button variant={"secondary"} className="rounded-full">
                            검색
                        </Button>
                    </div>
                </section>
                {/* HOT 토픽 */}
                <section className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src="/gifs/writing-hand.gif" alt="@WRITING-HAND_GIFS" className="w-7 mb-2" />
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                <GradientText text="HOT 토픽" gradient="linear-gradient(90deg, #40ffaa 0%, #4079ff 50%, #40ffaa 100%)" />
                            </h4>
                        </div>
                        <p className="text-neutral-500 text-base">지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를 얻어보세요.</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <HotTopic color="#e6b7d9" />
                        <HotTopic color="#e6b7d9" />
                        <HotTopic color="#e6b7d9" />
                        <HotTopic color="#e6b7d9" />
                    </div>
                </section>
                {/* NEW 토픽 */}
                <section className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src="/gifs/writing-hand.gif" alt="@WRITING-HAND_GIFS" className="w-7 mb-2" />
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                <GradientText text="NEW 토픽" gradient="linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)" />
                            </h4>
                        </div>
                        <p className="text-neutral-500 text-base">새로운 시선으로, 새로운 이야기를 시작하세요. 지금 바로 당신만의 토픽을 작성해보세요.</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <NewTopic />
                        <NewTopic />
                        <NewTopic />
                        <NewTopic />
                    </div>
                </section>
            </div>
            <Button variant={"destructive"} className="fixed bottom-35 left-[57%] -translate-1/2 p-5! rounded-full opacity-100" onClick={moveToPage}>
                <PencilLine />
                토픽 작성하기
            </Button>
        </div>
    );
}

export default App;
