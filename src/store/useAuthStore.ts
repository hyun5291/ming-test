import type {AuthStore, User} from "@/types";
import supabase from "@/utils/supabase";
import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (newUser: User | null) => set({user: newUser}),
            reset: async () => {
                set({user: null, session: null});
                localStorage.removeItem("ming-test");
                await supabase.auth.signOut();
            },

            session: null,
            setSession: (p: any | null) => set({session: p}),
        }),
        {name: "ming-test"} // locaStorage key
    )
);
