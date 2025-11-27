import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";

import "./index.css";
import Rootlayout from "./pages/layout.tsx"; //전역레이아웃
import App from "./App.tsx"; //메인
import SignUp from "./pages/auth/sign-up.tsx"; //회원가입
import SignIn from "./pages/auth/sign-in.tsx"; //로그인
import AuthcallbackGoogle from "./pages/auth/AuthcallbackGoogle.tsx";
import CreateTopic from "./pages/topic/create-topic.tsx"; //토픽작성
import DetailTopic from "./pages/topic/detail-topic.tsx"; //토픽상세
import Mychart from "./pages/Mychart.tsx"; //내챠트
import Chart_test from "./test/Chart_test.tsx"; //챠트테스트
import UserProfile from "./pages/user/profile.tsx";

//테스트
// import ExampleGetState from "./test/getState_test.tsx";
import Toast_test from "./test/Toast_test.tsx";
import Spinner_test from "./test/Spinner_test.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Rootlayout />}>
                    {/* Root */}
                    {/* <Route index element={<App />} /> */}
                    <Route path="/" element={<App />} />
                    {/* test */}
                    <Route path="/test/chart_test" element={<Chart_test />} />
                    {/* <Route path="/test/getState_test" element={<ExampleGetState />} /> */}
                    <Route path="/test/Toast_test" element={<Toast_test />} />
                    <Route path="/test/Spinner_test" element={<Spinner_test />} />
                    {/* mychart */}
                    <Route path="/mychart" element={<Mychart />} />
                    {/* AUTH */}
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/auth/callback" element={<AuthcallbackGoogle />} />
                    {/* USER */}
                    <Route path="/user/:id/profile" element={<UserProfile />} />
                    {/* TOPIC */}
                    <Route path="/topic/:topic_id/create" element={<CreateTopic />} />
                    <Route path="/topic/:topic_id" element={<DetailTopic />} />
                    <Route path="/topic/:topic_id/edit" element={<CreateTopic />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
