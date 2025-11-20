import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";

import "./index.css";
import Rootlayout from "./pages/layout.tsx"; //전역레이아웃
import App from "./App.tsx"; //메인
import SignUp from "./pages/auth/sign-up.tsx"; //회원가입
import SignIn from "./pages/auth/sign-in.tsx"; //로그인
import CreateTopic from "./pages/topic/create-topic.tsx"; //토픽작성
import DetailTopic from "./pages/topic/detail-topic.tsx"; //토픽상세
import UpdateTopic from "./pages/topic/update-topic.tsx"; //토픽수정
import Mychart from "./pages/Mychart.tsx"; //내챠트
import Chart_test from "./test/Chart_test.tsx"; //챠트테스트
import UserProfile from "./pages/user/profile.tsx";
import ExampleGetState from "./test/getState_test.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Rootlayout />}>
                    {/* Root */}
                    <Route index element={<App />} />
                    {/* test */}
                    <Route path="/test/chart_test" element={<Chart_test />} />
                    <Route path="/test/getState_test" element={<ExampleGetState />} />
                    {/* mychart */}
                    <Route path="/mychart" element={<Mychart />} />
                    {/* AUTH */}
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    {/* USER */}
                    <Route path="/user/:id/profile" element={<UserProfile />} />
                    {/* TOPIC */}
                    <Route path="/create-topic" element={<CreateTopic />} />
                    <Route path="/detail-topic/:id" element={<DetailTopic />} />
                    <Route path="/detail-topic/:id/edit" element={<UpdateTopic />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
