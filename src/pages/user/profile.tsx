import sessionStore from "@/store/sessionStore";
import {useEffect} from "react";
import {useNavigate} from "react-router";

function UserProfile() {
    const session = sessionStore((s) => s.session);
    const setSession = sessionStore((s) => s.setSession);
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) navigate("/sign-in");
    }, [session, setSession]);

    return <div>UserProfile1</div>;
}

export default UserProfile;
