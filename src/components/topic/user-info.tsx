import {Separator} from "../ui";
import {BadgeCheck} from "lucide-react";

interface UserProps {
    uid: string | null | undefined;
}

function UserInfo({uid}: UserProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <BadgeCheck size={14} className="text-green-500 mb-0.5" />
                <p>{uid === null ? "개발자 9Diin" : uid}</p>
            </div>
            <div className="flex items-center text-neutral-500 text-xs gap-2">
                <p>IT 및 기술분야</p>
                <Separator orientation="vertical" className="h-3!" />
                <p>소프트웨어 엔지니어</p>
            </div>
        </div>
    );
}

export {UserInfo};
