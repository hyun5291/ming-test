function AppNodataMessage() {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
            <img src="/vite.svg" alt="" className="w-6 h-6 opacity-50" />
            <p className="text-neutral-500/50">조회 가능한 데이터가 없습니다.</p>
        </div>
    );
}

export {AppNodataMessage};
