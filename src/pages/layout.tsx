import {Outlet, useLocation} from "react-router";
import {ThemeProvider} from "@/components/theme-provider";
import {AppFooter, AppHeader} from "@/components/common";
import {Toaster} from "@/components/ui/sonner";
import Galaxy from "@/components/backgrounds/Galaxy";
import {useEffect} from "react";
import supabase from "@/utils/supabase";
import {useAuthStore} from "@/store/useAuthStore";

function RootLayout() {
    const user = useAuthStore((s) => s.user);
    const session = useAuthStore((s) => s.session);
    const setSession = useAuthStore((s) => s.setSession);
    console.log("(layout)user>", user);
    // console.log("(layout)user.email>", user?.email);
    //console.log("(layout)session>", session);

    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        console.log("(layout)useEffect실행");
        // if (!session) return;
        // //supabase 자주 호출하기 싫어서 (유료라면 쫌....)
        // //zustand persist를 이용해 간간히 랜더링할때마다 만료 10분전인지를 체크한후
        // //10분이하로 남았을때만 supabase refresh토큰을 덮어쓰기

        // validateSession();
        // // 5분마다 체크
        // const interval = setInterval(() => {
        //     validateSession();
        // }, 5 * 60 * 1000);
        // // 컴포넌트 unmount 시 interval 제거
        // return () => clearInterval(interval);
        // ////  validateSession  /////////////////////////
        // async function validateSession() {
        //     const expiresAtMs = session.expires_at * 1000;
        //     const now = Date.now();
        //     const timeLeft = expiresAtMs - now;

        //     console.log("timeLeft>", timeLeft);

        //     // 만료까지 10분 이하라면 refresh 진행
        //     if (timeLeft <= 600000) {
        //         await refreshToken();
        //     }
        // }
        // ////  refreshToken  /////////////////////////
        // async function refreshToken() {
        //     try {
        //         //Supabase 새로운 세션 요청
        //         const {data, error} = await supabase.auth.refreshSession({
        //             refresh_token: session.refresh_token,
        //         });
        //         console.log("refreshSession>", data);

        //         if (error || !data.session) {
        //             //설마실패할일이있을까 체크.
        //             console.error("토큰 갱신 실패:", error);
        //             setSession(null);
        //             return;
        //         }

        //         setSession(data.session); //토큰 다시 로컬저장
        //     } catch (err) {
        //         //설마 여기까진않오겠지...
        //         console.error("Refresh 예외 발생:", err);
        //         setSession(null);
        //     }
        // }
        /////////////////////////////////////////////////////////
    }, [session, setSession]);

    // async function test_refreshToken() {
    //     console.log("테스트리프레쉬");
    //     try {
    //         //Supabase 새로운 세션 요청
    //         const {data, error} = await supabase.auth.refreshSession({
    //             refresh_token: session.refresh_token,
    //         });

    //         if (error || !data.session) {
    //             //설마실패할일이있을까 체크.
    //             console.error("토큰 갱신 실패:", error);
    //             setSession(null);
    //             return;
    //         }

    //         setSession(data.session); //토큰 다시 로컬저장
    //     } catch (err) {
    //         //설마 여기까진않오겠지...
    //         console.error("Refresh 예외 발생:", err);
    //         setSession(null);
    //     }
    // }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* Galaxy 배경 */}
            <Galaxy
                mouseRepulsion={true}
                mouseInteraction={false}
                density={1.0}
                glowIntensity={0.3}
                saturation={0.3}
                hueShift={140}
                starSpeed={0.5}
                rotationSpeed={0.1}
                // className="absolute inset-0 w-full h-full"
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
            />
            {/* <Button onClick={() => test_refreshToken()}>리프레쉬테스트</Button> */}
            <div className="relative flex flex-col items-center justify-center w-full text-white">
                <div className="w-full flex flex-col">
                    <AppHeader />
                    {/* 페이지별 콘텐츠 영역 */}
                    <main className="w-full flex-1 flex justify-center mt-12">
                        <Outlet />
                    </main>
                    <AppFooter />
                    <Toaster position="top-center" richColors />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default RootLayout;
