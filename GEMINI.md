# 🛡️ KidEnglish Frontend - Báo Cáo Kiến Trúc & Kỹ Thuật Sản Phẩm (Senior-Level Production Ready)

Tài liệu này tổng hợp toàn bộ kiến trúc, giải pháp kỹ thuật và các điểm sáng tối ưu hóa hiệu năng (performance), bảo mật (security), và tổ chức mã nguồn (architecture) của dự án **KidEnglish Frontend** theo tiêu chuẩn **Senior Developer**.

---

## 1. Sơ đồ Cấu trúc Thư mục (Directory Structure)

Thư mục `src` được thiết kế theo mô hình **Separation of Concerns (SoC)**, giúp chia tách rõ ràng giữa giao diện hiển thị (Presentation), xử lý logic nghiệp vụ (Business Logic), cấu hình (Configuration), và tích hợp API (Data Access).

```text
src/
├── apis/               # Định nghĩa các cuộc gọi API (Axios Instance, Services)
├── assets/             # Tài nguyên tĩnh (Hình ảnh, Biểu tượng, Fonts)
├── components/         # Các Component dùng chung (UI Primitives & Shared Components)
│   ├── admin/          # Route Guards & components bảo vệ tầng quản trị
│   └── ui/             # Shadcn/ui core components (Button, Input, Dialog, Table,...)
├── composeProviders.jsx# Hàm tiện ích gộp Context Providers để tránh Provider Hell
├── AppProviders.jsx    # Định nghĩa các nhóm Provider (Global, Client, Admin)
├── contexts/           # Quản lý State toàn cục bằng React Context API
│   ├── admin/          # Context phục vụ riêng cho Admin (Authentication, Authorization)
│   └── ...             # Contexts nghiệp vụ (Vocab, Quote, Category)
├── helpers/            # Các hàm helper định dạng dữ liệu (date, string, format...)
├── hooks/              # Custom Hooks tái sử dụng (useSearch, usePagination,...)
├── layouts/            # Giao diện khung chuẩn (AdminLayout, ClientLayout)
├── lib/                # Cấu hình các thư viện bên thứ ba (Utils, Axios configuration)
├── pages/              # Các trang chính chia theo phân hệ Admin và Client
│   ├── admin/          # Quản trị (Dashboard, Vocab, Quotes, Permissions, Roles, Users)
│   └── client/         # Phân hệ dành cho trẻ em/người dùng (Home, Vocab, Quotes, Profile)
├── reducers/           # Xử lý State phức tạp thông qua mô hình useReducer
├── utils/              # Các hằng số, giả lập dữ liệu, hàm tiện ích (cn, constants,...)
├── validations/        # Định nghĩa các Zod Validation Schema cho Forms
├── App.jsx             # Cấu hình Routing chính sử dụng React Router v7
└── main.jsx            # Điểm khởi chạy ứng dụng (Entry Point)
```

---

## 2. Điểm Sáng Kiến Trúc & Kỹ Thuật Tối Ưu (Senior-Level Engineering)

### 2.1 Giải quyết Triệt để "Provider Hell" bằng Composable Providers
Khi ứng dụng phình to, việc lồng quá nhiều Context Providers ở tầng root (`main.jsx`) sẽ tạo ra cấu trúc cây phân cấp sâu dạng "kim tự tháp" (Provider Hell), gây khó khăn cho việc bảo trì.
*   **Giải pháp**: Sử dụng hàm `composeProviders` (`src/composeProviders.jsx`) tận dụng phương thức `reduceRight` để gộp các component Provider một cách động.
*   **Chi tiết triển khai**:
    ```javascript
    export function composeProviders(...providers) {
      return ({ children }) =>
        providers.reduceRight(
          (acc, Provider) => <Provider>{acc}</Provider>,
          children
        )
    }
    ```
*   **Kết quả**: Tách biệt rõ ràng các nhóm quyền truy cập dữ liệu thành: `GlobalProviders`, `ClientProviders` và `AdminProviders`. Code ở `main.jsx` và `App.jsx` cực kỳ ngắn gọn, dễ đọc.

### 2.2 Dual-Auth Flow với Route Guards Cách Ly Tuyệt Đối
Hệ thống hỗ trợ 2 phân hệ chạy song song: **Client (Người học)** và **Admin (Quản trị viên)**. Để tránh rò rỉ dữ liệu và tối ưu bảo mật, luồng xác thực được bảo vệ nghiêm ngặt:
*   **PrivateRouteAdmin (`src/components/admin/PrivateRoute.jsx`)**: Chặn các truy cập trái phép vào trang quản trị khi chưa đăng nhập. Hiển thị Spinner tải dữ liệu mượt mà trong khi đang xác thực trạng thái (`authChecked` & `isLoading`).
*   **UnauthorizedRoutesAdmin (`src/components/admin/UnauthorizedRoutes.jsx`)**: Tự động chuyển hướng Admin đã đăng nhập ra khỏi trang đăng nhập (`/admin/auth/login`) về trang Dashboard, ngăn ngừa việc đăng nhập lặp lại vô nghĩa.
*   **Isolation**: Sử dụng context độc lập `AdminAuthContext` giúp phân hệ Admin không bị ảnh hưởng bởi token hay session của phân hệ Client.

### 2.3 Cơ chế Force Logout Khử Vòng Lặp Phụ Thuộc (Event-driven Decoupling)
Một lỗi kiến trúc phổ biến là import trực tiếp React hooks/contexts hoặc gọi hàm điều hướng Router (như `navigate`) trực tiếp bên trong Axios Interceptors (file JS thuần). Điều này gây lỗi React Hook Warning hoặc tạo ra vòng lặp import chéo (Circular Dependency).
*   **Giải pháp**: Sử dụng **Event Bus của Trình duyệt** (`window.dispatchEvent` kết hợp với `CustomEvent`).
*   **Cơ chế**: Khi Axios phát hiện lỗi `401 Unauthorized` hoặc lỗi Token Refresh thất bại (`410 Gone`), nó sẽ bắn ra một sự kiện toàn cục `'force-logout'`:
    ```javascript
    const event = new CustomEvent('force-logout')
    window.dispatchEvent(event)
    ```
*   **Phía React**: `AdminAuthContext` lắng nghe sự kiện này bằng `useEffect` để tự động reset state (`accountAdmin = null`, `role = null`) mà không cần can thiệp trực tiếp từ Axios vào React Component Tree.

### 2.4 Silent Token Refresh với Locking Promise
Để tối ưu trải nghiệm người dùng (UX), ứng dụng sử dụng cơ chế JWT Access Token ngắn hạn kết hợp với HttpOnly Cookie Refresh Token.
*   **Vấn đề**: Khi Access Token hết hạn, nếu Client gửi đồng thời nhiều API request (ví dụ: vừa tải danh sách từ vựng, vừa tải danh mục), tất cả các request này đều sẽ trả về lỗi hết hạn. Nếu không xử lý kỹ, hệ thống sẽ gửi liên tiếp nhiều request refresh token lên server, gây lãng phí tài nguyên và có thể làm mất hiệu lực token (token reuse detection trên backend).
*   **Giải pháp**: Sử dụng cơ chế khóa **Single Promise Locking**:
    ```javascript
    let refreshTokenPromise = null;
    
    // Khi nhận mã lỗi 410 (Token Expired)
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAdmin()
        .then((res) => res)
        .catch(async (error) => {
          await logoutAdmin().catch(() => {});
          window.dispatchEvent(new CustomEvent('force-logout'));
          return Promise.reject(error);
        })
        .finally(() => {
          refreshTokenPromise = null; // Mở khóa khi hoàn thành
        });
    }
    
    // Các request bị lỗi sau đó sẽ xếp hàng đợi chung một Promise này
    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest); // Retry request ban đầu
    });
    ```
*   **Hiệu quả**: Chỉ có duy nhất **1** request refresh token được gửi lên server. Tất cả các request gốc đang bị treo sẽ tự động thực hiện lại (Retry) ngay khi token mới được cấp thành công.

### 2.5 Dynamic Role-Permission Matrix (Quản lý Quyền Động)
Hệ thống triển khai giao diện quản trị ma trận phân quyền (`PermissionsPage`) trực quan, ánh xạ trực tiếp các **Nhóm quyền (Roles)** với **Tài nguyên (Resources)** và **Hành động (Actions)**.
*   Thiết lập phân quyền rõ ràng: `Super Admin` có toàn quyền, `Content Manager` có quyền quản lý nội dung (từ vựng, câu nói, danh mục) ngoại trừ xóa, và `Moderator` chỉ có quyền xem (Read-only).
*   State được quản lý tập trung và chuẩn bị sẵn sàng để đồng bộ với API thông qua `permissionApi.save(matrix)`.

---

## 3. Tối ưu Hóa Performance cho Môi trường Production

### 3.1 React Compiler & Auto-Memoization (React 19 & Babel compiler plugin)
*   Dự án đón đầu công nghệ tương lai của React bằng việc tích hợp **React Compiler** thông qua `@rolldown/plugin-babel` và `babel-plugin-react-compiler`.
*   **Lợi ích**: Tự động phân tích code và tối ưu hóa việc ghi nhớ (memoize) các component và dependency arrays lúc biên dịch. Lập trình viên không cần viết `useMemo` hay `useCallback` một cách thủ công, loại bỏ boilerplate code thừa mà vẫn bảo đảm ứng dụng không bị re-render dư thừa (re-render storm).

### 3.2 Tách biệt Logic Tìm kiếm & Phân trang thành Custom Hooks
Hệ thống xây dựng 2 custom hooks đa năng giúp tách logic xử lý tính toán ra khỏi UI Components:
*   `useSearch`: Nhận danh sách thô và mảng các field cần tìm kiếm, trả về state truy vấn và danh sách đã lọc bằng `useMemo`.
*   `usePagination`: Chia nhỏ dữ liệu đã lọc thành từng trang dựa trên hằng số `ITEMS_PER_PAGE`. Tự động tính toán tổng số trang (`totalPages`) và cắt mảng mượt mà.
*   **Kết quả**: UI Components như `VocabManagePage` chỉ tập trung vào việc render giao diện, toàn bộ logic tính toán tìm kiếm/phân trang đã được đóng gói và tái sử dụng dễ dàng cho các thực thể khác (Quotes, Users, Admins).

### 3.3 Form Validation Tối ưu Băng thông với Zod & React Hook Form
*   Tích hợp `react-hook-form` giúp tối ưu hóa hiệu năng nhập liệu (uncontrolled inputs), giảm số lần re-render component khi gõ phím so với controlled inputs thông thường.
*   Sử dụng `Zod` để thiết lập các schema kiểm chuẩn dữ liệu chặt chẽ ở Client-side.
*   **Điểm sáng**: Tối ưu hóa upload file avatar (`adminAvatarSchema`): Kiểm tra định dạng (chỉ cho phép hình ảnh) và dung lượng file (tối đa 2MB) ngay lập tức ở trình duyệt. Điều này ngăn chặn việc tải các file rác hoặc quá dung lượng lên máy chủ, tiết kiệm tối đa băng thông mạng.

---

## 4. UI/UX & Design System

*   **Tailwind CSS v4**: Tận dụng engine mới nhất của Tailwind giúp biên dịch nhanh hơn, tích hợp trực tiếp vào Vite và giảm thiểu tối đa CSS bundle size.
*   **Dynamic Theme & Badge Colors**: Thiết lập hệ thống hằng số màu sắc danh mục (`CATEGORY_COLORS`, `TAG_COLORS`) đồng bộ, giúp giao diện trực quan và thu hút trẻ em học tập (sử dụng các gam màu pastel nhẹ nhàng, kích thích thị giác).
*   **Shadcn/ui & Radix UI Integration**: Đảm bảo toàn bộ hệ thống modal, select dropdown, tables và dialog tuân thủ tiêu chuẩn Accessibility (WAI-ARIA), hoạt động mượt mà trên mọi thiết bị và trình duyệt.

---

## 5. Định Hướng Mở Rộng Hệ Thống (Next Steps for Production)

Để dự án đạt độ chín chắn cao nhất (Elite Level), một số định hướng sau có thể được triển khai:
1.  **Chuyển đổi hoàn toàn sang TypeScript**: Tận dụng các type định sẵn trong file `package.json` (`@types/react`, `@types/react-dom`, `@types/node`) để chuyển dịch mã nguồn sang `.tsx`, đảm bảo Type-safe tuyệt đối từ API DTOs đến Component Props.
2.  **Tích hợp React Query / SWR**: Thay thế Axios thuần ở một số màn hình hiển thị danh sách để tận dụng cơ chế Client-side Caching, Auto-refetching khi window focus, và Optimistic Updates.
3.  **Code Splitting / Lazy Loading**: Áp dụng `React.lazy` và `Suspense` cho các Page routes để chia nhỏ file JS bundle khi build production, giúp màn hình đăng nhập hoặc trang chủ của bé tải cực nhanh mà không cần tải trước code của trang Admin.
