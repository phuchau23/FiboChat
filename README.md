# FiboChat · FiboEdu

**Nền tảng web học tập thông minh** hỗ trợ sinh viên FPTU — tích hợp chat AI (mentor), quản lý lớp/học kỳ/chủ đề, và dashboard cho giảng viên & quản trị.

---

## Dự án

| Góc nhìn                   | Nội dung ngắn                                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vai trò sản phẩm**       | Full-stack **SPA/SSR hybrid** trên Next.js App Router, nhiều **vùng theo role** (public, admin, lecturer, chat mentor).                                                           |
| **Tích hợp real-time**     | **SignalR** (`@microsoft/signalr`) cho luồng chat bot / hub.                                                                                                                      |
| **Dữ liệu & trạng thái**   | **TanStack Query** cho cache, đồng bộ server state; **Axios** + lớp `ApiService` (interceptors, Bearer token).                                                                    |
| **Bảo mật & phân quyền**   | **Middleware** Next.js theo JWT cookie (`auth-token`), phân luồng **Admin / Lecturer**; **Firebase Auth** (cấu hình qua biến môi trường).                                         |
| **Trải nghiệm người dùng** | **Tailwind CSS** + **shadcn/ui (Radix)** + **Framer Motion**; **i18next** (vi/en); **next-themes**; markdown (`react-markdown`) cho nội dung rich text an toàn với **DOMPurify**. |
| **Chất lượng code**        | **TypeScript**, **ESLint**, cấu trúc module theo feature (`app/`), tách **hooks**, **lib/api/services**, **components**.                                                          |

---

## Tech stack (kỹ năng công nghệ trong repo)

**Core**

- [Next.js 15](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [Turbopack](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack) (`dev` / `build` trong `package.json`)

**UI & hiển thị**

- [Tailwind CSS](https://tailwindcss.com/) · [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- [Radix UI](https://www.radix-ui.com/) (dialog, dropdown, tabs, toast, …) · [class-variance-authority](https://cva.style/) · [lucide-react](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/) / `motion`
- [Recharts](https://recharts.org/) (biểu đồ dashboard)
- [Sonner](https://sonner.emilkowal.ski/) · toast Radix

**Dữ liệu & API**

- [TanStack Query](https://tanstack.com/query) (+ DevTools)
- [Axios](https://axios-http.com/) — client tập trung trong `lib/api/core.ts`

**Real-time & backend tương tác**

- [Microsoft SignalR Client](https://www.npmjs.com/package/@microsoft/signalr) — `hooks/useChatbotHub.ts`

**Auth & bảo mật**

- Cookie: [cookies-next](https://github.com/andreizanik/cookies-next) · [js-cookie](https://github.com/js-cookie/js-cookie)
- JWT: [jwt-decode](https://github.com/auth0/jwt-decode) · [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (types)
- [Firebase](https://firebase.google.com/) (Auth) — `lib/firebase/`

**Quốc tế hóa & nội dung**

- [i18next](https://www.i18next.com/) · [react-i18next](https://react.i18next.com/) — namespace động từ `locales/<lang>/<namespace>.json`

**Khác**

- [date-fns](https://date-fns.org/) · [uuid](https://github.com/uuidjs/uuid) · [cmdk](https://cmdk.paco.me/) · [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify)

---

## Cấu trúc thư mục (overview)

```
FiboChat/
├── app/                          # Next.js App Router — routes & layouts theo nhóm
│   ├── (auth)/                   # Đăng nhập, quên/đổi mật khẩu (layout riêng)
│   ├── (admin)/admin/            # Khu vực Admin: overview, user, class, semester, topic, lecturer, …
│   ├── (lecturer)/lecturer/      # Khu vực Giảng viên: overview, class, topic, feedback, …
│   ├── (fibo_mentor)/chat/       # Chat AI / Q&A (sidebar, hub, feedback, …)
│   ├── (user)/profile/           # Hồ sơ người dùng
│   ├── layout.tsx                # Root: Theme, React Query, Auth providers
│   ├── page.tsx                  # Landing / home
│   └── globals.css
├── components/                   # Component dùng chung + `ui/` (primitives)
├── hooks/                        # Logic tái sử dụng (SignalR, domain, CRUD hooks, …)
├── lib/
│   ├── api/
│   │   ├── core.ts               # Axios instance + interceptors
│   │   └── services/             # fetch* theo domain (user, class, topic, conversation, …)
│   ├── firebase/                 # Cấu hình Firebase Auth
│   ├── providers/                # Auth, Query, Theme, AuthInit
│   └── …
├── utils/                        # JWT, cookie, format, error helpers, …
├── locales/                      # i18n: ví dụ vi/en, namespace (common, …)
├── public/                       # Static assets
├── middleware.ts                 # Bảo vệ route + redirect theo role (JWT)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

**Gợi ý đọc code nhanh**

- Luồng bảo vệ route: `middleware.ts`
- Client API: `lib/api/core.ts` + `lib/api/services/*`
- Chat real-time: `hooks/useChatbotHub.ts`, `app/(fibo_mentor)/chat/`
- Global providers: `app/layout.tsx` → `lib/providers/*`

---

## Vai trò người dùng (theo codebase)

- **Admin** — `/admin/*`: quản trị người dùng, lớp, học kỳ, chủ đề, giảng viên, dashboard tổng quan.
- **Lecturer** — `/lecturer/*`: lớp học, chủ đề, tài liệu, feedback, thống kê/overview.
- **Người dùng chat / mentor (Fibo)** — giao diện chat, cặp Q&A, phản hồi (vùng `(fibo_mentor)/chat`).
- **Khách / đã đăng nhập** — landing, profile, auth flows.

_(Chi tiết màn hình nằm dưới từng thư mục `app/.../page.tsx` và `components/` tương ứng.)_

---

## Chạy local

**Yêu cầu:** Node.js (khuyến nghị LTS), npm.

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

**Scripts**

| Lệnh            | Mô tả                  |
| --------------- | ---------------------- |
| `npm run dev`   | Dev server (Turbopack) |
| `npm run build` | Build production       |
| `npm run start` | Chạy bản build         |
| `npm run lint`  | ESLint                 |

---

## Biến môi trường

Ứng dụng kỳ vọng các biến (tối thiểu cho API và Firebase). Tham chiếu trong code:

- `NEXT_PUBLIC_API_BASE_URL` — base URL backend + SignalR hub path
- `NEXT_PUBLIC_FIREBASE_*` — `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
- Tùy chọn cookie/domain (xem `utils/cookieConfig.ts`): `COOKIE_DOMAIN` / `NEXT_PUBLIC_COOKIE_DOMAIN`, `COOKIE_SAMESITE`, v.v.

Tạo file `.env.local` ở root project và điền giá trị phù hợp môi trường của bạn (không commit secret).

---

## License & ghi chú

Private project (`"private": true` trong `package.json`). Nội dung README phản ánh cấu trúc và dependency tại thời điểm chỉnh sửa; khi thêm module mới, nên cập nhật mục **Tech stack** và **Cấu trúc thư mục** cho đồng bộ.
