import { useEffect, useMemo, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
const formatAbsoluteAndRelative = (isoString: string) => {
    // KST 기준으로 변환
    const dt = DateTime.fromISO(isoString, { zone: "utc" }).setZone("Asia/Seoul");

    // 절대시간 포맷
    // const absolute = dt.toFormat("yyyy-MM-dd HH:mm:ss");
    // const absolute = dt.toFormat("yy-MM-dd");
    const absolute = dt.toFormat("yy-MM-dd");

    // 현재 시간
    const now = DateTime.now().setZone("Asia/Seoul");

    // 시간과 분 차이 계산
    const diff = now.diff(dt, ["days", "hours", "minutes"]);
    const days = Math.floor(diff.days);
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);

    // 상대시간
    const relative = dt.toRelative({ locale: "ko" }); // ko,ja,fr,en // ex ${relative} : (1일 전)  //(47시간59분전까지 1일 전)
    // const ret_str = `${absolute} (${days}일 ${hours}시간 ${minutes}분 전)`;
    const ret_str = `${absolute} `;

    return ret_str;
};

const chartData = [
    { date: "1", amount: 111, tooltip: "aaa" },
    { date: "2", amount: 222, tooltip: "bb" },
    { date: "3", amount: 23, tooltip: "c" },
    { date: "4", amount: 77, tooltip: "d" },
];

function aaa() {
    const item = { tooltip: 11 };
    const label = "123";

    item?.tooltip ?? label;

    if (item != null && item.tooltip != null) return item.tooltip;
    else return label;
}

function Chart_test() {
    return (
        <div>
            <LineChart width={1200} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                {/* <YAxis domain={[0, 3650000]} /> */}
                {/* <Tooltip /> */}
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="p-1 border border-purple-400 rounded shadow">
                                    <p>날짜: {data.date}</p>
                                    <p>금액: {data.amount}</p>
                                    <p>설명: {data.tooltip}</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
        </div>
    );
}

export default Chart_test;
