// import path from "path";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import {defineConfig} from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//     plugins: [react(), tailwindcss()],
//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, "./src"),
//         },
//     },
// });

// import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // server: {
    //     port: 5173,
    //     //HTTPS 설정
    //     https: {
    //         key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")), // 개인키
    //         cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")), // 인증서
    //     },
    // },
});
