// import {useState} from "react";
// import sessionStore from "@/store/sessionStore";

// export default function ExampleGetState() {
//     // 로컬 상태는 화면 렌더링용
//     const [renderCount, setRenderCount] = useState(0);

//     // const user = sessionStore((state) => state.user);
//     // const setUser = sessionStore((state) => state.setUser);
//     // const {user, setUser} = sessionStore.getState();
//     const {user, setUser} = sessionStore();

//     const handleLogin = () => {
//         // Zustand 상태 업데이트
//         // sessionStore.getState().setUser({id: "123", email: "test@example.com"});
//         // 렌더링을 강제로 증가시키지 않으면 UI에는 변화 없음
//         setUser("123");
//         console.log(sessionStore.getState().user);
//         console.log(user);
//     };

//     return (
//         <div>
//             <p>User: {JSON.stringify(sessionStore.getState().user)}</p>
//             <button onClick={handleLogin}>Login</button>
//             <p>Render count: {renderCount}</p>

//             <p>test: </p>
//         </div>
//     );
// }
