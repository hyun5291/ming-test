import {NavLink, useNavigate} from "react-router";
import supabase from "@/utils/supabase";
import {Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input} from "@/components/ui";
import {toast} from "sonner";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useAuthStore} from "@/store/useAuthStore";

const formSchema = z.object({
    email: z.email("올바른 형식의 이메일 주소를 입력해주세요."),
    password: z.string().min(8, {
        message: "비밀번호는 최소한 8자 이상으로 작성해주세요.",
    }),
});

function SignIn() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const navigate = useNavigate();

    // 일반 로그인
    const {setUser, setSession} = useAuthStore(); //스토어

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const {
                data: {user, session},
                error: signInError,
            } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (signInError) {
                toast.error(signInError.message === "Invalid login credentials" ? "입력하신 정보가 일치하지 않습니다." : "로그인 중 오류가 발생하였습니다.");
                return;
            }
            console.log(user);
            console.log(session);

            // user와 session 두 값 모두 null이 아닐 경우에만 로그인이 완료되었음을 의미
            if (user && session) {
                // 로그인 성공 시,
                console.log("(sign-in)user>", user);
                console.log("(sign-in)session>", session);
                setUser({id: user.id, email: user.email, role: user.role}); //스토어
                setSession(session); //스토어
                toast.success("로그인을 완료하였습니다.");
                navigate("/"); // => 메인 페이지로 리디렉션
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    //소셜 로그인 (구글)
    const handleGoogleSignIn = async () => {
        try {
            //
            const {data, error} = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${import.meta.env.VITE_SUPABASE_URL_LOCALHOST}/auth/callback`,
                    queryParams: {access_type: "offline", prompt: "consent"},
                },
            });
            if (data) {
                console.log("handleGoogleSignIn>>>>>>>>", data);
            }
            if (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    return (
        <div className="w-full max-w-[1328px] h-full flex items-center justify-center">
            <Card className="w-full max-w-sm border-0 bg-transparent">
                <CardHeader className="gap-0">
                    <CardTitle className="text-lg">로그인</CardTitle>
                    <CardDescription>로그인을 위한 정보를 입력해주세요</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>이메일</FormLabel>
                                        <FormControl>
                                            <Input placeholder="이메일을 입력하세요." {...field} autoComplete="username" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>비밀번호</FormLabel>
                                            <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                비밀번호를 잊으셨나요?
                                            </a>
                                        </div>
                                        <FormControl>
                                            <Input type="password" placeholder="비밀번호를 입력하세요." {...field} autoComplete="current-password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    로그인
                                </Button>
                                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                                    <img src="/icons/google.svg" alt="@GOOGLE" className="w-4" />
                                    구글 로그인
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="w-full flex items-center justify-center gap-2 -mt-3">
                        <p>계정이 없으신가요?</p>
                        {/* <Button variant={"link"} className="p-0 underline" onClick={() => navigate("/sign-up")}>
                            회원가입
                        </Button> */}
                        <NavLink to={"/sign-up"} className="underline underline-offset-4">
                            회원가입
                        </NavLink>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignIn;
