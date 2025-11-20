import {NavLink, useNavigate} from "react-router";
import {Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Separator} from "../ui";
import sessionStore from "@/store/sessionStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
function AppHeader() {
    const user = sessionStore((s) => s.user);
    const signOut = sessionStore((s) => s.signOut);

    const navigate = useNavigate();
    const logOut = async () => {
        await signOut();

        navigate("/sign-in");
    };

    return (
        <header className="fixed z-20 w-full h-12 min-h-12 flex items-center justify-center border-b-2 ">
            <div className="w-full max-w-[1328px] h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* <img src="" alt="@LOGO" /> */}
                    <NavLink to={"/"} className={"text-neutral-400 hover:text-white "}>
                        토픽 인사이트
                    </NavLink>
                    <Separator orientation="vertical" className="h-3!" />
                    <NavLink to={"/user/:id/profile"} className={"text-neutral-400 hover:text-white"}>
                        프로필
                    </NavLink>
                </div>
                <div className="flex items-center gap-4 ">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-0 bg-transparent focus:outline-none opacity-80">
                                    {user?.email}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-55">
                                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    onClick={() => {
                                        navigate(`/user/${123}/profile`);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    프로필
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    onClick={() => {
                                        logOut();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    로그아웃
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <NavLink to={"/sign-in"} className="text-neutral-400 hover:text-white duration-300 font-bold">
                            로그인
                        </NavLink>
                    )}

                    <Separator orientation="vertical" className="h-3!" />
                    <NavLink to={"/"} className="text-neutral-400 hover:text-white duration-300 font-bold">
                        우리가 하는 일
                    </NavLink>
                </div>
            </div>
        </header>
    );
}

export {AppHeader};
