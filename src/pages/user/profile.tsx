import {useAuthStore} from "@/store/useAuthStore";
import {useEffect} from "react";
import {useNavigate} from "react-router";

function UserProfile() {
    const user = useAuthStore((s) => s.user);
    const session = useAuthStore((s) => s.session);
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) navigate("/sign-in");
    }, [session]);

    return <div>{user?.id}님의 프로파일</div>;
}

export default UserProfile;
