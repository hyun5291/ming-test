// import {Spinner} from "@/components/ui";
import {useAuthStore} from "@/store/useAuthStore";
import supabase from "@/utils/supabase";
import {useEffect} from "react";
// import {useNavigate} from "react-router";

function AuthcallbackGoogle() {
    const setUser = useAuthStore((s) => s.setUser);
    const setSession = useAuthStore((s) => s.setSession);
    // const navigate = useNavigate();

    useEffect(() => {
        const loadSession = async () => {
            const {data, error} = await supabase.auth.getSession();

            console.log("callback data >", data);
            console.log("callback session >", data.session);

            if (data.session) {
                setSession(data.session);
                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email,
                    role: data.session.user.role,
                });

                // 로그인 후 원하는 페이지로 이동
                // navigate("/sign-in");
                console.log("tt>", data);
                console.log("aa>", data.session);
            }
            if (error) {
                console.log(error);
            }
        };

        loadSession();

        // 실시간 상태 변화 감지
        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email as string,
                    role: session.user.role as string,
                });
            } else {
                setUser(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <div>
            Auth.................
            {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-xs">
                <Spinner className="size-8" />
            </div> */}
        </div>
    );
}

export default AuthcallbackGoogle;
