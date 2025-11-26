import {useEffect, useMemo, useState} from "react";
import supabase from "@/utils/supabase";
import {DateTime} from "luxon";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
    username: z.string().min(7, {
        message: "숫자7자리",
    }),
});

const formatAbsoluteAndRelative = (isoString: string) => {
    // KST 기준으로 변환
    const dt = DateTime.fromISO(isoString, {zone: "utc"}).setZone("Asia/Seoul");

    // 절대시간 포맷
    // const absolute = dt.toFormat("yyyy-MM-dd HH:mm:ss");
    // const absolute = dt.toFormat("yy-MM-dd");
    const absolute = dt.toFormat("yy-MM-dd");

    // 현재 시간
    // const now = DateTime.now().setZone("Asia/Seoul");

    // 시간과 분 차이 계산
    // const diff = now.diff(dt, ["days", "hours", "minutes"]);
    // const days = Math.floor(diff.days);
    // const hours = Math.floor(diff.hours);
    // const minutes = Math.floor(diff.minutes);

    // // 상대시간
    // const relative = dt.toRelative({ locale: "ko" }); // ko,ja,fr,en // ex ${relative} : (1일 전)  //(47시간59분전까지 1일 전)
    // const ret_str = `${absolute} (${days}일 ${hours}시간 ${minutes}분 전)`;
    const ret_str = `${absolute} `;

    return ret_str;
};

// 커스텀 Tooltip 컴포넌트
const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div>
                <p>금액: {data.amount}</p>
                <p>{data.tooltip}</p>
            </div>
        );
    }
    return null;
};
function Mychart() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const ok = await handleInsert(values.username);
        console.log(values);
        if (ok) form.resetField("username");
    }

    const [tb_data, setTb_data] = useState<any[]>([]);

    async function getTodos() {
        try {
            const {data, error} = await supabase.from("graph").select("*").order("id", {ascending: true});

            if (error) {
                return [];
            }

            console.log("data", data);
            return data ?? [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getTodos();

            setTb_data(result);
        }
        fetchData();
    }, []);

    const chartData = useMemo(() => {
        return tb_data.map((item, idx) => ({
            date: DateTime.fromISO(item.created_at, {zone: "utc"}).setZone("Asia/Seoul").toFormat("yyyy MM-dd HH:mm") + " (" + idx + ")",
            amount: item.amount,
            tooltip: DateTime.fromISO(item.created_at, {zone: "utc"}).setZone("Asia/Seoul").toFormat("yyyy-MM-dd HH:mm:ss"),
        }));
    }, [tb_data]);

    const handleInsert = async (val: any) => {
        console.log("handleInsert");

        const {data, error} = await supabase.from("graph").insert([{amount: val}]);

        if (error) {
            console.error(error);
            alert("등록 실패");
            return false;
        } else if (data) {
            // 등록 성공하면 상태 업데이트
            const updatedData = await getTodos();
            setTb_data(updatedData);
            return true;
        }
    };

    const handleDelete = async (val: any, e: any) => {
        console.log("handleDelete>", e);
        const {error} = await supabase.from("graph").delete().eq("id", val);
        if (error) {
            console.error(error);
            alert("삭제 실패");
            return false;
        } else {
            // 등록 성공하면 상태 업데이트
            const updatedData = await getTodos();
            setTb_data(updatedData);
            return true;
        }
    };

    const CustomXAxisTick = ({x, y, payload}: any) => {
        const MAX_CHAR_PER_LINE = 5; // 한 줄 최대 글자 수
        const value: string = payload.value;

        const lines: string[] = [];

        // 1. 공백 기준으로 먼저 나누기
        const words = value.split(" "); // 공백 단위로 나누기
        words.forEach((word) => {
            // 2. 각 단어가 MAX_CHAR_PER_LINE보다 길면 나누기
            for (let i = 0; i < word.length; i += MAX_CHAR_PER_LINE) {
                lines.push(word.slice(i, i + MAX_CHAR_PER_LINE));
            }
        });

        return (
            <g transform={`translate(${x},${y + 10})`}>
                <text x={0} y={0} textAnchor="middle" fill="#666" fontSize={12}>
                    {lines.map((line, index) => (
                        <tspan key={index} x={0} dy={index === 0 ? 0 : 14}>
                            {line}
                        </tspan>
                    ))}
                </text>
            </g>
        );
    };

    return (
        <div>
            {/* 입력 + 버튼 */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
                    <div className="flex gap-4">
                        {/* 입력 필드 */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem className="">
                                    <FormLabel className="sr-only">Username</FormLabel> {/* 화면에는 안보이게 HTML 폼 표준 준수<label>은 <input>과 연동되어야 함*/}
                                    <FormControl>
                                        <Input placeholder="1,000,000~3,700,000" {...field} className="w-60" />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 버튼 */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>등록</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>등록하실래요?</AlertDialogTitle>
                                    <AlertDialogDescription>DB 데이터 등록됩니다.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            form.handleSubmit(onSubmit)();
                                        }}
                                    >
                                        확인
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </form>
            </Form>

            <LineChart width={1200} height={500} data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                {/* <XAxis dataKey="date" /> */}
                <XAxis
                    dataKey="date"
                    tick={<CustomXAxisTick />}
                    interval={0} // 모든 tick 표시
                    tickSize={20} // tick 글자 높이 여유
                    height={70} // X축 영역 높이 늘리기
                />
                <YAxis />
                <YAxis domain={[0, 3650000]} /> {/* y축 범위를 0~500으로 고정 */}
                {/* <Tooltip /> */}
                <Tooltip content={<CustomTooltip />} /> {/* 커스텀 Tooltip 적용 */}
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>

            <div className="mt-5">
                {tb_data.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                        <div className="border">{item.id}</div>
                        <div className="border">created_at:{formatAbsoluteAndRelative(item.created_at)}</div>
                        <div className="border">amount:{item.amount}</div>

                        {/* 삭제 버튼 Dialog */}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">삭제</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>삭제하실래요?</AlertDialogTitle>
                                    <AlertDialogDescription>db데이터삭제됩니다.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction onClick={(e) => handleDelete(item.id, e)}>확인</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Mychart;
