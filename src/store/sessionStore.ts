import supabase from "@/utils/supabase";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface SessionState {
    user: any | null;
    session: any | null;
    setUser: (user: any) => void;
    setSession: (session: any) => void;
    signOut: () => Promise<void>;
}

const sessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            setUser: (user) => set({user}),
            setSession: (session) => set({session}),
            signOut: async () => {
                set({user: null, session: null});
                localStorage.removeItem("ming-session"); //persist 로컬지우고
                await supabase.auth.signOut(); //supabase도 로그아웃 supabase로컬저장소역시삭제
            },
        }),
        {
            name: "ming-session", //로컬저장소이용
        }
    )
);
export default sessionStore;
