import {ChartNoAxesCombined, ChevronDown, CodeXml, DraftingCompass, Footprints, Goal, Icon, Lightbulb, List, PencilLine, Rocket, Search} from "lucide-react";
import {Button, Input, Spinner} from "./components/ui";
import {HotTopic, NewTopic} from "./components/topic";
import {useNavigate} from "react-router";
import {GradientText} from "./components/ui/shadcn-io/gradient-text";
import {toast} from "sonner";
import {useAuthStore} from "./store/useAuthStore";
import supabase from "./utils/supabase";
import {useEffect, useRef, useState} from "react";
import type {Topic} from "./types";

const CATEGORIES = [
    {icon: List, label: "전체", searchValue: ""},
    {icon: Lightbulb, label: "인문학", searchValue: "humidity"},
    {icon: Rocket, label: "스타트업", searchValue: "start-up"},
    {icon: CodeXml, label: "IT·프로그래밍", searchValue: "programming"},
    {icon: Goal, label: "서비스·전략 기획", searchValue: "planning"},
    {icon: ChartNoAxesCombined, label: "마케팅", searchValue: "marketing"},
    {icon: DraftingCompass, label: "디자인·일러스트", searchValue: "design"},
    {icon: Footprints, label: "자기계발", searchValue: "self-development"},

    //<SelectItem value="humidity">인문학</SelectItem>
    //<SelectItem value="start-up">스타트업</SelectItem>
    //<SelectItem value="programming">IT&middot;프로그래밍</SelectItem>
    //<SelectItem value="planning">서비스&middot;전략 기획</SelectItem>
    //<SelectItem value="marketing">마케팅</SelectItem>
    //<SelectItem value="design">디자인&middot;일러스트</SelectItem>
    //<SelectItem value="self-development">자기계발</SelectItem>
];

function App() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    // console.log("App>", user);

    const [nowcate, setNowcate] = useState<string>(""); //선택카테고리
    const [topics, setTopics] = useState<Topic[]>([]);

    // 1. 전체 항목을 클릭했을 경우, "전체"라는 항목의 value 값을 어떻게 할 것인가? -공백.
    // 2. 이미 선택된 항목에 대해 즉, 선택된 항목 재선택시 어떻게 할 것인가? -리소스아끼기 리턴
    // 3. 도메인 즉, URL에 카테고리 value 값을 보여줄 것인지 아닌지? -안보여줌 그냥랜더링(선택시 카데고리 백그라운드 보더)
    // 4. 결국, Supabase Read의 Filtering 기능 사용할 때 어떻게 할 것인가? -카데고리=eq,검색어는like
    // 5. 검색 기능과의 차별점을 둘 것인가? -묶어서 같이해결
    const handleCategoryChange = (value: string, type: string) => {
        //
        if (type === "cate" && nowcate === value) return; //리소스아끼기
        if (type === "cate") {
            setNowcate(value);
            fetchTopics(value, type);
        }
        if (type === "typing" && value === "") return; //리소스아끼기
        if (type === "typing") {
            fetchTopics(value, type);
        }
    };

    const fetchTopics = async (value: string, type: string) => {
        try {
            //const {data, error} = await supabase.from("topics").select("*").order("created_at", {ascending: false}).limit(4).eq("status", "PUBLISH");
            let query = supabase.from("topics").select("*").eq("status", "PUBLISH").order("created_at", {ascending: false}).limit(4);
            if (type === "cate" && value !== "") query = query.eq("category", value);
            if (type === "typing") {
                query = query.like("title", `%${value}%`);
                if (nowcate !== "") query = query.eq("category", nowcate);
            }
            console.log("fetch val>", value);
            const {data, error} = await query;
            if (error) {
                toast.warning(error.message);
                return;
            }
            if (data) {
                //
                //console.log("App-data>", data);
                setTopics(data);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
    useEffect(() => {
        fetchTopics("", "");
    }, []);

    const moveToPage = async () => {
        if (!user) {
            toast.warning("토픽 작성은 로그인 후 이용 가능합니다.");
            return;
        }
        try {
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
                    {/* <Button className="flex justify-start text-white bg-transparent hover:bg-card hover:text-white hover:pl-6 duration-500">
                        <List />
                        전체
                    </Button> */}
                    {CATEGORIES.map((category, idx) => {
                        const IconComponent = category.icon;
                        return (
                            <Button
                                key={idx}
                                className={`flex justify-start ${
                                    nowcate === category.searchValue ? "text-white border-2 bg-input/30" : "text-neutral-500 bg-transparent"
                                }  hover:bg-card hover:text-white hover:pl-6 duration-500 cursor-pointer`}
                                onClick={() => handleCategoryChange(category.searchValue, "cate")}
                            >
                                <IconComponent />
                                {nowcate === category.searchValue ? (
                                    <GradientText text={category.label} gradient="linear-gradient(90deg,#ffffff 0%, #e68ee3 50%, #e0c3fc 100%)" className="font-extrabold" />
                                ) : (
                                    <GradientText text={category.label} gradient="linear-gradient(90deg,#ffffff 0%, #e68ee3 50%, #e0c3fc 100%)" className="font-bold" />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </aside>
            <div className="min-h-screen flex-1 flex flex-col gap-12">
                <section className="w-full flex flex-col items-center justify-center gap-3">
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
                        <Input
                            placeholder="관심 있는 클래스, 토픽 주제를 검색하세요."
                            className="border-none bg-transparent! focus-visible:ring-0 placeholder:text-base"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCategoryChange(e.currentTarget.value.replace(/\s+/g, ""), "typing");
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
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
                        {topics.map((data, idx) => (
                            <HotTopic key={idx} props={data} color="#e6b7d9" />
                        ))}
                        {/* 항상4개를 표시하고싶어서 부족한 개수만큼 NewTopic 렌더링 */}
                        {Array.from({length: Math.max(4 - topics.length, 0)}).map((_, idx) => (
                            <HotTopic key={`empty-${idx}`} color="#e6b7d9" />
                        ))}
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
                        {topics.map((data, idx) => (
                            <NewTopic key={idx} props={data} color="7df9ff" />
                        ))}
                        {/* 항상4개를 표시하고싶어서 부족한 개수만큼 NewTopic 렌더링 */}
                        {Array.from({length: Math.max(4 - topics.length, 0)}).map((_, idx) => (
                            <NewTopic key={`empty-${idx}`} />
                        ))}
                    </div>
                </section>
            </div>
            <Button variant={"destructive"} className="fixed bottom-40 left-[57%] -translate-1/2 p-5! rounded-full opacity-80 cursor-pointer" onClick={moveToPage}>
                <PencilLine />
                토픽 작성하기
            </Button>
        </div>
    );
}

export default App;
