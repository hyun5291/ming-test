import {AppTextEditor} from "@/components/common";
import {Button, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Separator, Spinner} from "@/components/ui";
import supabase from "@/utils/supabase";
import {ArrowLeft, Asterisk, BookOpenCheck, Image, ImageOff, Save, Trash2} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {toast} from "sonner";
import {nanoid} from "nanoid";
import {useAuthStore} from "@/store/useAuthStore";
import type {Block} from "@blocknote/core";

function CreateTopic() {
    const [loading, setLoading] = useState(false);
    const {topic_id} = useParams();
    const user = useAuthStore((s) => s.user);
    const session = useAuthStore((s) => s.session);
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) navigate("/sign-in");
    }, [session, user]);

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<Block[]>([]);

    const [category, setCategory] = useState<string>("");
    const [thumbnail, setThumbnail] = useState<File | string | null>(null);
    //file 타입의 원본 데이터를 받음. supabase의 이미지만 관리하는 storage에 전달받은 file 저장(URL)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    //파일변화감지및 상태값할당
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (e.target.files) setThumbnail(e.target.files?.[0]);
        // else setThumbnail(null);
        setThumbnail(e.target.files?.[0] ?? null);
        //동일 파일 선택이 불가능할수도 있으므로 초기화
        e.target.value = "";
        console.log(e.target.files);
    };

    //-------------이미지 미리보기//-------------//-------------//-------------//-------------
    const handleRenderPreview = () => {
        if (typeof thumbnail === "string") {
            return <img src={thumbnail} alt="@THUMBNAIL" className="w-full aspect-video rounded-md object-cover" />;
        } else if (thumbnail instanceof File) {
            // thumbnail은 File객체여야합니다.
            //예를들어 인풋파일에서 사용자가 선택한 파일을 나타내는 객체입니다.
            //createObjectURL 메서드는 파일을 브라우저에서 사용할수있는 임시url로변환한다.
            //이url은 해당파일에 대한 참조를 제공하여 로컬에서만유효,즉 이 url은 서버에서 접근할수없고 클라이언트(사용자의브라우저)내에서만유효합니다.
            //변환된 url을이미지 비디오 오디오 등의 미디어파일에 사용할수잇습니다.
            return <img src={URL.createObjectURL(thumbnail)} alt="@THUMBNAIL" className="w-full aspect-video rounded-md object-cover" />;
        }
        return (
            <div className="w-full aspect-video flex items-center justify-center rounded-md bg-card" onClick={() => fileInputRef.current?.click()}>
                <Button variant={"ghost"} size={"icon"}>
                    <Image />
                </Button>
                <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
            </div>
        );
    };

    //-------------저장버튼로직시작//-------------//-------------//-------------//-------------//-------------
    const handleSave = async () => {
        setLoading(true);
        console.log("thumbnail>", (thumbnail as File)?.name);
        if (!title && !category && !thumbnail) {
            toast.warning("입력되지 않은 항목이 있습니다. 필수값을 입력해주세요.");
            return;
        }
        //1.파일 업로드 시 supabase의 storage 즉, bucket 폴더에 이미지를 먼저 업로드 한 후
        //이미지가 저장된 bucket 폴더의 경로 url주소를 우리가 관리하고 있는 topics 테이블 thumbnail 컬럼에 문자열 형태
        //즉, string, 타입으로저장(db text)
        // return;

        //최초로 파일을 db에저장할경우 or 새로운 파일을 업로드할경우
        let thumbnailUrl: string | null = null;
        // console.log(thumbnail);
        if (thumbnail && thumbnail instanceof File) {
            //파일 storage에업로드
            const fileExt = thumbnail.name.split(".").pop(); //파일확장자 뽑기
            const fileName = `${nanoid()}.${fileExt}`;
            const filePath = `topics/${fileName}`;
            const bucketName = "ming-files";

            const {error: fileUploadError} = await supabase.storage.from(bucketName).upload(filePath, thumbnail);
            if (fileUploadError) {
                throw fileUploadError;
            }
            const {data} = supabase.storage.from(bucketName).getPublicUrl(filePath);
            if (!data) {
                toast.error("해당 파일의 Public URL 조회를 실패하였습니다.");
                throw new Error("해당 파일의 Public URL 조회를 실패하였습니다.");
            }
            console.log("data.publicUrl(create-topic.tsx)", data.publicUrl);
            thumbnailUrl = data.publicUrl;
        }
        //-------------업데이트 db로직//-------------//-------------//-------------//-------------//-------------
        console.log("업데이트고~");
        // const jsonContent = JSON.stringify(block_editor.document); //컨텐츠불러오기 blocknote
        try {
            const {data, error} = await supabase
                .from("topics")
                .update({author: user?.id, title: title, category: category, content: JSON.stringify(content), thumbnail: thumbnailUrl, status: "TEMP", created_at: "now()", updated_at: "now()"})
                .eq("id", topic_id)
                .select();

            if (error || !data) {
                console.error("저장실패", error);
                toast.warning("저장실패");
                return;
            }
            console.log(data);
            if (data) {
                setLoading(false);
                toast.warning("저장완료");
            }
        } catch (err) {
            console.error("예외 발생:", err);
            setLoading(false);
        }
    };
    //-------------발행버튼 로직//-------------//-------------//-------------//-------------//-------------
    const handlePublish = async () => {
        setLoading(true);
        if (!title || !category || !thumbnail || !content) {
            toast.warning("입력되지 않은 항목이 있습니다. 필수값을 입력해주세요.");
            setLoading(false);
            return;
        }
        let thumbnailUrl: string | null = null;
        if (thumbnail && thumbnail instanceof File) {
            //파일 storage에업로드
            const fileExt = thumbnail.name.split(".").pop(); //파일확장자 뽑기
            const fileName = `${nanoid()}.${fileExt}`;
            const filePath = `topics/${fileName}`;
            const bucketName = "ming-files";

            const {error: fileUploadError} = await supabase.storage.from(bucketName).upload(filePath, thumbnail);
            if (fileUploadError) {
                throw fileUploadError;
            }
            const {data} = supabase.storage.from(bucketName).getPublicUrl(filePath);
            if (!data) {
                toast.error("해당 파일의 Public URL 조회를 실패하였습니다.");
                throw new Error("해당 파일의 Public URL 조회를 실패하였습니다.");
            }
            console.log("data.publicUrl(create-topic.tsx)", data.publicUrl);
            thumbnailUrl = data.publicUrl;
        }

        // const jsonContent = JSON.stringify(block_editor.document); //컨텐츠불러오기 blocknote
        //-------------db update 로직//-------------//-------------//-------------//-------------//-------------
        const {data, error} = await supabase
            .from("topics")
            .update({author: user?.id, title: title, category: category, content: JSON.stringify(content), thumbnail: thumbnailUrl, status: "PUBLISH", created_at: "now()", updated_at: "now()"})
            .eq("id", topic_id)
            .select();

        if (error || !data) {
            console.error("발행실패", error);
            toast.warning("발행실패");
            return;
        }
        console.log(data);
        if (data) {
            setLoading(false);
            toast.warning("토픽을 발행하였습니다.");
            navigate("/");
        }
    };

    //-------------//-------------//-------------//-------------//-------------//-------------//-------------
    return (
        <main className="w-full flex-1 flex justify-center">
            {/* 로딩 블러 overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-xs">
                    <Spinner className="size-8" />
                </div>
            )}
            <div className="w-full max-w-[1328px] h-full flex gap-6 py-6">
                {/* STEP 01 */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-col">
                        <p className="font-medium text-[#FA6859]">Step 1</p>
                        <p className="font-semibold text-base">토픽 작성하기</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Asterisk size={14} className="text-[#FA6859]" />
                                <p className="text-neutral-500 text-base">제목</p>
                            </div>
                            <Input
                                placeholder="토픽 제목을 입력하세요."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-16 placeholder:text-lg placeholder:font-semibold text-lg! font-semibold px-5 border-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Asterisk size={14} className="text-[#FA6859]" />
                                <p className="text-neutral-500 text-base">본문</p>
                            </div>
                            {/* Blocknote 텍스트 에디터 UI */}
                            <div className="w-full h-screen">
                                <AppTextEditor props={content} onSetContent={setContent} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* STEP 02 */}
                <div className="w-[314px] min-w-[314px] flex flex-col gap-6">
                    <div className="flex flex-col">
                        <p className="font-medium text-[#FA6859]">Step 2</p>
                        <p className="font-semibold text-base">카테고리 및 썸네일 등록</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-6">
                        {/* 카테고리 */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Asterisk size={14} className="text-[#FA6859]" />
                                <p className="text-neutral-500 text-base">카테고리</p>
                            </div>
                            {/* 셀렉트 박스 */}
                            <Select value={category} onValueChange={(val) => setCategory(val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="토픽(주제) 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>카테고리(주제)</SelectLabel>
                                        <SelectItem value="humidity">인문학</SelectItem>
                                        <SelectItem value="start-up">스타트업</SelectItem>
                                        <SelectItem value="programming">IT&middot;프로그래밍</SelectItem>
                                        <SelectItem value="planning">서비스&middot;전략 기획</SelectItem>
                                        <SelectItem value="marketing">마케팅</SelectItem>
                                        <SelectItem value="design">디자인&middot;일러스트</SelectItem>
                                        <SelectItem value="self-development">자기계발</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* 썸네일 */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Asterisk size={14} className="text-[#FA6859]" />
                                <p className="text-neutral-500 text-base">썸네일</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {handleRenderPreview()}

                                {/* 썸네일 제거 버튼 */}
                                <Button
                                    variant={"secondary"}
                                    className="bg-card"
                                    onClick={() => {
                                        setThumbnail(null);
                                    }}
                                >
                                    <ImageOff />
                                    썸네일 제거
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-12 flex items-center gap-2">
                <Button variant={"outline"} className="px-5!">
                    <ArrowLeft />
                </Button>
                <Button variant={"outline"} className="px-5! bg-amber-900/30!" onClick={handleSave}>
                    <Save />
                    저장
                </Button>
                <Button variant={"outline"} className="px-5! bg-emerald-900/30!" onClick={handlePublish}>
                    <BookOpenCheck />
                    발행
                </Button>
                <Button variant={"outline"} className="px-5! bg-red-900/30!">
                    <Trash2 />
                </Button>
            </div>
        </main>
    );
}

export default CreateTopic;
