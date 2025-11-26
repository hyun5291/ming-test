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

// ------------------------
// Form Validation Schema
// ------------------------
const formSchema = z.object({
    username: z.string().min(7, {message: "숫자7자리"}),
});

// ------------------------
// 날짜 포맷 및 상대시간 계산 함수
// ------------------------
const formatAbsoluteAndRelative = (isoString: string) => {
    const dt = DateTime.fromISO(isoString, {zone: "utc"}).setZone("Asia/Seoul");

    // 절대시간 포맷 (삭제 가능: 다른 포맷 시 참고용)
    // const absolute = dt.toFormat("yyyy-MM-dd HH:mm:ss"); // 삭제 가능
    // const absolute = dt.toFormat("yy-MM-dd"); // 삭제 가능
    const absolute = dt.toFormat("yy-MM-dd"); // 현재 사용 포맷

    // 현재 시간
    // const now = DateTime.now().setZone("Asia/Seoul");

    // // 시간과 분 차이 계산 (삭제 가능: 단순 절대시간 표시만 사용시)
    // const diff = now.diff(dt, ["days", "hours", "minutes"]);
    // const days = Math.floor(diff.days);
    // const hours = Math.floor(diff.hours);
    // const minutes = Math.floor(diff.minutes);

    // // 상대시간 (삭제 가능: tooltip 등에서 활용 가능)
    // const relative = dt.toRelative({ locale: "ko" }); // 예: "1일 전"

    const ret_str = `${absolute} `; // 현재 화면 표시용
    return ret_str;
};

// ------------------------
// 커스텀 Tooltip 컴포넌트
// ------------------------
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

// ------------------------
// 커스텀 XAxis Tick (개행 처리)
// ------------------------
const CustomXAxisTick = ({x, y, payload}: any) => {
    const lines = payload.value.split(" "); // 공백 기준 줄바꿈
    return (
        <g transform={`translate(${x},${y + 10})`}>
            <text x={0} y={0} textAnchor="middle" fill="#666" fontSize={12}>
                {lines[0]} {/* 한 줄만 표시 */}
            </text>
        </g>
    );
};

// ------------------------
// Main Component
// ------------------------
function Mychart() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {username: ""},
    });

    const [tb_data, setTb_data] = useState<any[]>([]);

    // ------------------------
    // DB 조회 함수
    // ------------------------
    async function getTodos() {
        try {
            const {data, error} = await supabase.from("graph").select("*").order("id", {ascending: true});
            if (error) {
                console.error(error);
                return [];
            }
            return data ?? [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // ------------------------
    // 데이터 fetch on mount
    // ------------------------
    useEffect(() => {
        async function fetchData() {
            const result = await getTodos();
            setTb_data(result);
        }
        fetchData();
    }, []);

    // ------------------------
    // chartData Memoization
    // ------------------------
    const chartData = useMemo(() => {
        return tb_data.map((item, idx) => ({
            date: DateTime.fromISO(item.created_at, {zone: "utc"}).setZone("Asia/Seoul").toFormat("dd") + " (" + idx + ")",
            amount: item.amount,
            tooltip: DateTime.fromISO(item.created_at, {zone: "utc"}).setZone("Asia/Seoul").toFormat("yyyy-MM-dd HH:mm:ss"),
        }));
    }, [tb_data]);

    // ------------------------
    // DB insert
    // ------------------------
    const handleInsert = async (val: any) => {
        console.log("handleInsert");
        const {data, error} = await supabase.from("graph").insert([{amount: val}]);
        if (error) {
            console.error(error);
            alert("등록 실패");
            return false;
        } else if (data) {
            const updatedData = await getTodos();
            setTb_data(updatedData);
            return true;
        }
    };

    // ------------------------
    // DB delete
    // ------------------------
    const handleDelete = async (val: any, e: any) => {
        console.log("handleDelete>", e);
        const {error} = await supabase.from("graph").delete().eq("id", val);
        if (error) {
            console.error(error);
            alert("삭제 실패");
            return false;
        } else {
            const updatedData = await getTodos();
            setTb_data(updatedData);
            return true;
        }
    };

    // ------------------------
    // Form submit
    // ------------------------
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const ok = await handleInsert(values.username);
        console.log(values);
        if (ok) form.resetField("username");
    }

    // ------------------------
    // Render
    // ------------------------
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
                                <FormItem>
                                    <FormLabel className="sr-only">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1,000,000~3,700,000" {...field} className="w-60" />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 등록 버튼 */}
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
                                    <AlertDialogAction onClick={() => form.handleSubmit(onSubmit)()}>확인</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </form>
            </Form>

            {/* 라인차트 */}
            <LineChart width={1200} height={300} data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" tick={<CustomXAxisTick />} />
                <YAxis />
                <YAxis domain={[0, 3650000]} /> {/* y축 범위 고정 */}
                <Tooltip content={<CustomTooltip />} /> {/* 커스텀 Tooltip */}
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>

            {/* DB 데이터 리스트 + 삭제 버튼 */}
            <div>
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
                                    <AlertDialogDescription>DB 데이터 삭제됩니다.</AlertDialogDescription>
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
