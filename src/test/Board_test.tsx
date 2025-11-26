// App.tsx
import React, {useState, useEffect} from "react"; // React 라이브러리와 상태관리(useState), 생명주기(useEffect) 훅을 가져옴
import {createClient, SupabaseClient} from "@supabase/supabase-js"; // Supabase 클라이언트 생성 함수와 타입을 가져옴
import axios from "axios"; // HTTP 요청 라이브러리, Google Drive API 호출용

// ----------------------------
// 1️⃣ DB 타입 정의
// ----------------------------

// 게시글(Post) 타입 정의
// Supabase posts 테이블에 대응
export interface Post {
    id: number; // Supabase에서 자동 생성되는 기본 키 (PK)
    title: string; // 게시글 제목
    content: string; // 게시글 내용
    file_url?: string | null; // 업로드된 파일 링크, optional
    created_at: string; // 작성 시간, Supabase 자동 생성
}

// 전체 DB 스키마 정의
// Supabase Client 생성 시 타입 안전성을 위해 필요
export interface Database {
    public: {
        tables: {
            posts: Post; // posts 테이블에 Post 타입 매핑
        };
        views: {}; // 뷰는 사용하지 않음, 타입 안정성용
        functions: {}; // DB 함수는 사용하지 않음, 타입 안정성용
    };
}

// ----------------------------
// 2️⃣ Supabase Client 생성
// ----------------------------

// Supabase 프로젝트 URL
const supabaseUrl: string = "https://your-project.supabase.co";

// Supabase 익명 키 (프론트엔드용)
const supabaseKey: string = "YOUR_SUPABASE_ANON_KEY";

// Supabase Client 생성
// SupabaseClient<Database> 타입으로 지정하여 DB 스키마 기반 타입 추론 가능
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseKey);

// ----------------------------
// 3️⃣ React 컴포넌트 정의
// ----------------------------
export default function App() {
    // 게시글 배열 상태 관리, 초기값 빈 배열
    const [posts, setPosts] = useState<Post[]>([]);

    // 새 게시글 제목 상태 관리
    const [title, setTitle] = useState<string>("");

    // 새 게시글 내용 상태 관리
    const [content, setContent] = useState<string>("");

    // 업로드할 파일 상태 관리, 초기값 null
    const [file, setFile] = useState<File | null>(null);

    // 버튼 및 처리 상태를 위한 로딩 상태 관리
    const [loading, setLoading] = useState<boolean>(false);

    // Google Drive OAuth 토큰
    // 실제 서비스에서는 백엔드에서 안전하게 발급 후 전달하는 것이 안전
    const GOOGLE_DRIVE_TOKEN: string = "YOUR_GOOGLE_DRIVE_ACCESS_TOKEN";

    // ----------------------------
    // 게시글 로드 함수
    // ----------------------------
    const fetchPosts = async (): Promise<void> => {
        // Supabase posts 테이블에서 전체 게시글 가져오기
        // .select("*") → 모든 컬럼 선택
        // .order("created_at", { ascending: false }) → 최신순 정렬
        const {data, error} = await supabase
            .from("posts") // 테이블 이름만 지정, Client 타입 덕분에 Post 타입 추론
            .select("*")
            .order("created_at", {ascending: false});

        if (error) {
            // 오류 발생 시 콘솔 출력
            console.error("Error fetching posts:", error);
        } else {
            // 가져온 데이터를 상태에 저장 → UI 렌더링에 반영
            setPosts(data || []);
        }
    };

    // ----------------------------
    // 컴포넌트 마운트 시 게시글 불러오기
    // ----------------------------
    useEffect(() => {
        fetchPosts(); // 페이지 로드 시 한 번 실행
    }, []); // 빈 배열 → 의존성 없음, 한 번만 실행

    // ----------------------------
    // Google Drive 파일 업로드 함수
    // ----------------------------
    const uploadToGoogleDrive = async (file: File): Promise<string | null> => {
        try {
            // FormData 객체 생성 → multipart/form-data 형식 전송
            const formData = new FormData();
            formData.append("file", file); // 실제 업로드할 파일 추가
            formData.append("name", file.name); // 파일 이름 지정

            // Google Drive API 업로드 요청
            // axios.post(url, data, config) 사용
            const response = await axios.post(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=media", // Media upload 엔드포인트
                file, // 파일 자체를 본문으로 전송
                {
                    headers: {
                        Authorization: `Bearer ${GOOGLE_DRIVE_TOKEN}`, // OAuth 토큰 인증
                        "Content-Type": file.type, // MIME 타입 지정
                    },
                }
            );

            // 업로드 성공 시 반환된 파일 ID
            const fileId: string = response.data.id;

            // Google Drive 파일 다운로드 링크 생성
            const fileLink: string = `https://drive.google.com/uc?id=${fileId}&export=download`;

            // 게시글 DB에 저장할 URL 반환
            return fileLink;
        } catch (error) {
            // 업로드 실패 시 오류 콘솔 출력 후 null 반환
            console.error("Google Drive upload error:", error);
            return null;
        }
    };

    // ----------------------------
    // 게시글 작성 및 업로드 함수
    // ----------------------------
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        setLoading(true); // 로딩 상태 시작

        let fileLink: string | null = null; // 업로드된 파일 링크 초기값 null

        // 파일이 선택되어 있으면 Google Drive에 업로드
        if (file) {
            fileLink = await uploadToGoogleDrive(file);
        }

        // Supabase posts 테이블에 게시글 삽입
        // const { data, error } = await supabase
        //     .from("posts") // 테이블 이름만 지정
        //     .insert([
        //         {
        //             title, // 입력 제목
        //             content, // 입력 내용
        //             file_url: fileLink, // 업로드된 파일 링크
        //         },
        //     ]);

        // if (error) {
        //     // 삽입 실패 시 콘솔 출력 및 알림
        //     console.error("Error inserting post:", error);
        //     alert("Failed to create post");
        // } else {
        //     // 성공 시 입력 필드 초기화
        //     setTitle("");
        //     setContent("");
        //     setFile(null);

        //     // 게시글 목록 재갱신
        //     fetchPosts();
        // }

        setLoading(false); // 로딩 상태 종료
    };

    // ----------------------------
    // JSX 렌더링
    // ----------------------------
    return (
        <div style={{maxWidth: "600px", margin: "auto", padding: "20px"}}>
            <h1>React + Supabase + Google Drive 게시판</h1>

            {/* 게시글 작성 폼 */}
            <form onSubmit={handleSubmit} style={{marginBottom: "20px"}}>
                {/* 제목 입력 */}
                <input
                    type="text"
                    placeholder="제목"
                    value={title} // React state와 연결
                    onChange={(e) => setTitle(e.target.value)} // 입력값 변경 시 상태 업데이트
                    required
                    style={{width: "100%", marginBottom: "10px", padding: "8px"}}
                />
                {/* 내용 입력 */}
                <textarea
                    placeholder="내용"
                    value={content} // React state와 연결
                    onChange={(e) => setContent(e.target.value)} // 입력값 변경 시 상태 업데이트
                    required
                    style={{width: "100%", marginBottom: "10px", padding: "8px"}}
                />
                {/* 파일 선택 */}
                <input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setFile(e.target.files[0]); // 선택된 파일 상태에 저장
                        }
                    }}
                    style={{marginBottom: "10px"}}
                />
                {/* 제출 버튼 */}
                <button type="submit" disabled={loading}>
                    {loading ? "업로드 중..." : "게시글 작성"}
                </button>
            </form>

            {/* 게시글 목록 렌더링 */}
            <div>
                {posts.map((post) => (
                    <div
                        key={post.id} // React에서 리스트 렌더링 시 key 필요
                        style={{border: "1px solid #ccc", padding: "10px", marginBottom: "10px"}}
                    >
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        {/* 파일 링크가 있을 경우 */}
                        {post.file_url && (
                            <div>
                                <a href={post.file_url} target="_blank" rel="noopener noreferrer">
                                    업로드된 파일 보기
                                </a>
                            </div>
                        )}
                        <small>{new Date(post.created_at).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
