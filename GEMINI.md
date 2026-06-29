# 🛡️ KidEnglish Frontend - Hướng Dẫn Kiến Trúc & Hành Động (Senior-Level Production Ready)

Tài liệu này là **nguồn sự thật duy nhất (Single Source of Truth)** cho AI Assistant về kiến trúc, trạng thái hiện tại, công việc còn lại, và quy ước code của dự án **KidEnglish Frontend**.

---

## 1. Sơ đồ Cấu trúc Thư mục (Directory Structure)

```text
src/
├── apis/
│   ├── admin/index.js       # adminVocabApi, adminQuoteApi, adminVocabTagsApi, adminQuoteTagsApi,
│   │                        # adminAuthApi, adminAccountApi, userAccountApi, adminRoleApi, permissionApi
│   └── client/index.js      # vocabApi, quoteApi, authUserApi
├── assets/
├── components/
│   ├── admin/
│   │   ├── PrivateRoute.jsx      # Route guard cho admin (kiểm tra AdminAuthContext)
│   │   ├── UnauthorizedRoutes.jsx# Redirect admin đã login khỏi /admin/auth/login
│   │   ├── VocabModal.jsx        # Modal thêm/sửa từ vựng (có upload ảnh)
│   │   ├── QuoteModal.jsx        # Modal thêm/sửa câu nói
│   │   ├── TagsModal.jsx         # Modal thêm/sửa thẻ (dùng chung VocabTags & QuoteTags)
│   │   └── RoleModal.jsx         # Modal thêm/sửa nhóm quyền
│   ├── client/
│   │   ├── PrivateRoute.jsx      # Route guard cho user (kiểm tra UserAuthContext)
│   │   └── UnauthorizedRoutes.jsx# Redirect user đã login khỏi /login, /register
│   ├── ui/                       # Shadcn/ui components (Button, Input, Dialog, Label,...)
│   ├── CategoryBadge.jsx
│   ├── ConfirmDialog.jsx
│   ├── PageHeader.jsx
│   ├── Pagination.jsx
│   ├── SearchBar.jsx
│   └── StatusBadge.jsx
├── composeProviders.jsx      # Utility: gộp Context Providers tránh Provider Hell
├── AppProviders.jsx          # GlobalProviders, ClientProviders, AdminProviders
├── contexts/
│   ├── admin/
│   │   ├── AdminAuthContext.jsx  # State đăng nhập admin (accountAdmin, role, isLoading, authChecked)
│   │   ├── VocabTagsContext.jsx  # State & fetch tags loại VOCAB
│   │   ├── QuoteTagsContext.jsx  # State & fetch tags loại QUOTE
│   │   └── RoleContext.jsx       # State & fetch danh sách roles
│   ├── client/
│   │   └── UserAuthContext.jsx   # State đăng nhập user (user, isLoading, authChecked)
│   ├── VocabContext.jsx          # ⚠️ MOCK DATA - Cần chuyển sang gọi vocabApi
│   ├── QuoteContext.jsx          # ⚠️ MOCK DATA - Cần chuyển sang gọi quoteApi
│   ├── CategoryContext.jsx       # ⚠️ MOCK DATA - Cần chuyển sang gọi categoryApi (chưa có)
│   └── index.js
├── helpers/
├── hooks/
│   ├── useSearch.js         # Tìm kiếm client-side với useMemo
│   ├── usePagination.js     # Phân trang client-side
│   └── useDebounce.js       # Debounce input (dùng trong VocabManagePage)
├── layouts/
│   ├── AdminLayout.jsx
│   └── ClientLayout.jsx
├── lib/
├── pages/
│   ├── admin/
│   │   ├── AdminLoginPage.jsx       # ✅ Kết nối API (adminAuthApi.loginAdmin)
│   │   ├── AdminProfilePage.jsx     # ✅ Kết nối API (adminAuthApi.me, updateMe, uploadAvatar)
│   │   ├── AdminSettingsPage.jsx    # ✅ Kết nối API (adminAuthApi.changePassword)
│   │   ├── VocabManagePage.jsx      # ✅ Kết nối API (adminVocabApi) - Cursor Pagination + Debounce
│   │   ├── QuoteManagePage.jsx      # ✅ Kết nối API (adminQuoteApi) - Cursor Pagination + Debounce
│   │   ├── VoCabTagsManagePage.jsx  # ✅ Kết nối API (adminVocabTagsApi)
│   │   ├── QuoteTagsManagePage.jsx  # ✅ Kết nối API (adminQuoteTagsApi)
│   │   ├── RoleManagePage.jsx       # ✅ Kết nối API (adminRoleApi)
│   │   ├── AdminManagePage.jsx      # ⚠️ MOCK DATA - Cần kết nối adminAccountApi
│   │   ├── UserManagePage.jsx       # ⚠️ MOCK DATA - Cần kết nối userAccountApi
│   │   ├── DashboardPage.jsx        # ⚠️ MOCK DATA - Cần kết nối dashboardApi (thống kê thật)
│   │   └── PermissionsPage.jsx      # ⚠️ MOCK DATA - handleSave chưa gọi permissionApi.save
│   └── client/
│       ├── LoginPage.jsx            # ✅ Kết nối API (authUserApi.login)
│       ├── RegisterPage.jsx         # ✅ Kết nối API (authUserApi.register)
│       ├── ProfilePage.jsx          # ⚠️ Commented out - Cần kết nối UserAuthContext + authUserApi.updateMe
│       ├── HomePage.jsx             # ⚠️ MOCK DATA - Stats hardcode, dùng QuoteContext (mock)
│       ├── VocabularyPage.jsx       # ⚠️ MOCK DATA - Dùng VocabContext (mock), cần gọi vocabApi
│       └── QuotesPage.jsx           # ⚠️ MOCK DATA - Dùng QuoteContext (mock), cần gọi quoteApi
├── reducers/                # vocabReducer, quoteReducer, categoryReducer (dùng với MOCK DATA)
├── utils/
│   ├── authorizedAxiosAdmin.js  # Axios instance Admin (Bearer token + silent refresh + force-logout)
│   ├── authorizedAxiosClient.js # Axios instance Client (Bearer token + silent refresh + force-logout-user)
│   ├── constants.js             # CATEGORY_COLORS, TAG_COLORS, ITEMS_PER_PAGE, API_ROOT
│   ├── mockData.js              # ⚠️ Dữ liệu giả - xóa dần khi kết nối API xong
│   ├── formatVietnamDateTime.js # Helper format ngày giờ theo múi giờ VN
│   ├── cn.js                    # Utility: merge Tailwind classes (clsx + twMerge)
│   └── index.js                 # Re-export API_ROOT
├── validations/             # Zod schemas (adminLoginSchema, adminAvatarSchema,...)
├── App.jsx                  # React Router v7 - routing toàn bộ app
└── main.jsx                 # Entry point
```

---

## 2. Trạng Thái Hiện Tại & Công Việc Còn Lại

### 2.1 Phân hệ Admin — Đã hoàn thiện ✅

| Trang                 | Trạng thái | Ghi chú                                        |
| --------------------- | ---------- | ---------------------------------------------- |
| `AdminLoginPage`      | ✅ API     | `adminAuthApi.loginAdmin`                      |
| `AdminProfilePage`    | ✅ API     | `me`, `updateMe`, `uploadAvatar`               |
| `AdminSettingsPage`   | ✅ API     | `changePassword`                               |
| `VocabManagePage`     | ✅ API     | Cursor pagination, debounce search, upload ảnh |
| `QuoteManagePage`     | ✅ API     | Cursor pagination, debounce search             |
| `VoCabTagsManagePage` | ✅ API     | `adminVocabTagsApi` CRUD                       |
| `QuoteTagsManagePage` | ✅ API     | `adminQuoteTagsApi` CRUD                       |
| `RoleManagePage`      | ✅ API     | `adminRoleApi` CRUD                            |

### 2.2 Phân hệ Admin — Cần hoàn thiện ⚠️

#### `AdminManagePage.jsx` — Cần kết nối `adminAccountApi`

- Hiện tại dùng `MOCK_ADMINS` (useState từ mockData)
- **Việc cần làm**:
  1. Bỏ import `MOCK_ADMINS`, thêm `useEffect` gọi `adminAccountApi.getAll()` để fetch danh sách
  2. Kết nối nút "Thêm admin" → `adminAccountApi.create(form)`
  3. Kết nối nút sửa → `adminAccountApi.update(id, form)`
  4. Kết nối nút xóa → `adminAccountApi.remove(id)`
  5. Thêm `toast` thông báo thành công/thất bại
  6. Khi save/delete xong → gọi lại `fetchAdmins()` để reload danh sách

#### `UserManagePage.jsx` — Cần kết nối `userAccountApi`

- Hiện tại dùng `MOCK_USERS` (useState từ mockData)
- **Việc cần làm**:
  1. Bỏ import `MOCK_USERS`, thêm `useEffect` gọi `userAccountApi.getAll()` để fetch danh sách
  2. Kết nối nút sửa → `userAccountApi.update(id, form)` (cập nhật status, tên, email)
  3. Lưu ý: API `userAccountApi` chưa có endpoint xóa user, cân nhắc soft-delete
  4. Thêm `toast` thông báo thành công/thất bại

#### `DashboardPage.jsx` — Cần API thống kê thật

- Hiện tại: stats lấy từ `.length` của context mock, "Hoạt động gần đây" là dữ liệu tĩnh
- **Việc cần làm**:
  1. Tạo `adminDashboardApi` trong `apis/admin/index.js`:
     ```javascript
     export const adminDashboardApi = {
       getStats: () => requestAuthorized("GET", "/admin/dashboard/stats"),
       getRecentActivity: () =>
         requestAuthorized("GET", "/admin/dashboard/recent-activity"),
     };
     ```
  2. Trong `DashboardPage`, dùng `useEffect` + `useState` để fetch và hiển thị dữ liệu thật
  3. Thay thế placeholder biểu đồ bằng thư viện `recharts` hoặc `chart.js`

#### `PermissionsPage.jsx` — Cần kết nối `permissionApi`

- Hiện tại: ma trận build từ `MOCK_ROLES`, `handleSave` có TODO nhưng chưa gọi API
- **Việc cần làm**:
  1. Khi mount, gọi `permissionApi.getMatrix()` để load ma trận thật từ server
  2. `handleSave` → gọi `permissionApi.save(matrix)` + `toast` thông báo
  3. Thay `MOCK_ROLES` bằng data thật từ `RoleContext` hoặc `adminRoleApi.getAll()`

### 2.3 Phân hệ Client — Cần hoàn thiện ⚠️

#### `ProfilePage.jsx` — Cần kết nối `UserAuthContext`

- Hiện tại: toàn bộ `useAuth` và header gradient bị comment out, form dùng hardcode value
- **Việc cần làm**:
  1. Uncomment import `useUserAuth` từ `@/contexts/client/UserAuthContext`
  2. Bỏ comment phần UI gradient header và thay hardcode bằng data thật: `user.fullName`, `user.email`
  3. Dùng `react-hook-form` + `zodResolver` với `profileSchema` cho form chỉnh sửa
  4. Kết nối nút "Lưu thay đổi" → `authUserApi.updateMe(form)` → gọi `refreshUser()` từ context

#### `VocabularyPage.jsx` — Cần kết nối `vocabApi`

- Hiện tại: dùng `useVocab()` → `VocabContext` (MOCK_VOCABS), `useCategory()` → `CategoryContext` (MOCK_CATEGORIES)
- **Việc cần làm**:
  1. Bỏ import VocabContext và CategoryContext
  2. Dùng `useEffect` + `useState` để gọi `vocabApi.getAll()` và `vocabApi.getAllCategories()` (hoặc endpoint tương đương)
  3. Thêm loading state (skeleton hoặc spinner)
  4. Filter category ở client-side hoặc server-side tùy backend hỗ trợ
  5. Cập nhật `vocabApi` trong `apis/client/index.js` nếu endpoint backend thay đổi

#### `QuotesPage.jsx` — Cần kết nối `quoteApi`

- Hiện tại: dùng `useQuote()` → `QuoteContext` (MOCK_QUOTES), filter `isToday` chỉ có ý nghĩa với mock data
- **Việc cần làm**:
  1. Bỏ import QuoteContext
  2. Gọi `quoteApi.getAll()` để lấy danh sách câu nói
  3. Lấy "câu nói hôm nay" từ endpoint riêng hoặc field `isToday` do backend trả về
  4. Thay tag filter hardcode `['all', 'study', 'motivation', 'friendship']` bằng tag thật từ API

#### `HomePage.jsx` — Cần kết nối dữ liệu thật

- Hiện tại: stats hardcode (0/0), `todayQuote` lấy từ `QuoteContext` (mock)
- **Việc cần làm**:
  1. Gọi API lấy stats của user đang đăng nhập: số sao, streak, từ đã học, sticker
  2. Gọi API lấy "câu nói hôm nay" riêng biệt
  3. Dùng `useUserAuth()` để lấy thông tin user hiện tại nếu cần personalize

---

## 3. Kiến Trúc Kỹ Thuật Nổi Bật

### 3.1 Dual-Auth Flow — Cách Ly Tuyệt Đối

Hai hệ thống auth chạy song song, **không chia sẻ token, context, hay axios instance**:

| Phân hệ | Context            | Axios Instance          | Event Force-Logout  |
| ------- | ------------------ | ----------------------- | ------------------- |
| Admin   | `AdminAuthContext` | `authorizedAxiosAdmin`  | `force-logout`      |
| Client  | `UserAuthContext`  | `authorizedAxiosClient` | `force-logout-user` |

- **`PrivateRouteAdmin`**: Chờ `authChecked && !isLoading` trước khi quyết định redirect
- **`UnauthorizedRoutesAdmin`**: Redirect admin đã đăng nhập từ `/admin/auth/login` → `/admin/dashboard`
- **`PrivateRouteUser`**: Tương tự cho client — chờ `authChecked` rồi kiểm tra `isAuthenticated`
- **`UnauthorizedRoutesUser`**: Redirect user đã đăng nhập từ `/login`, `/register` → `/`

### 3.2 Silent Token Refresh — Single Promise Locking

Cả `authorizedAxiosAdmin` và `authorizedAxiosClient` đều triển khai cơ chế này:

```javascript
let refreshTokenPromise = null;

// Response interceptor: khi nhận lỗi 410 (token expired)
if (error.response?.status === 410) {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshTokenAdmin()
      .catch(async (err) => {
        await logoutAdmin().catch(() => {});
        window.dispatchEvent(new CustomEvent("force-logout"));
        return Promise.reject(err);
      })
      .finally(() => {
        refreshTokenPromise = null;
      });
  }
  // Tất cả requests bị treo đều chờ chung 1 promise
  return refreshTokenPromise.then(() =>
    authorizedAxiosInstance(originalRequest),
  );
}
```

**Tại sao dùng 410 thay vì 401?**

- `401` được dùng cho lỗi "sai credentials" khi login
- `410 Gone` là signal rõ ràng "access token đã hết hạn, cần refresh" — tránh nhập nhằng

### 3.3 Force Logout — Event-driven Decoupling

Axios interceptor (file JS thuần) không thể import React hooks hay gọi `navigate()`.

- **Giải pháp**: `window.dispatchEvent(new CustomEvent('force-logout'))` / `'force-logout-user'`
- **React context lắng nghe**: `window.addEventListener('force-logout', handleForceLogout)` trong `useEffect`
- Kết quả: **zero circular dependency**, code sạch hoàn toàn

### 3.4 Cursor Pagination (Server-side) cho Admin

`VocabManagePage` và `QuoteManagePage` dùng cursor-based pagination thay vì offset:

```javascript
const [nextCursor, setNextCursor] = useState(null);
const [hasMore, setHasMore] = useState(false);

// Load lần đầu hoặc khi search thay đổi: cursorToFetch = null
// Tải thêm (Load More): cursorToFetch = nextCursor hiện tại
const fetchVocabularies = useCallback(
  async (cursorToFetch = null) => {
    const params = { limit: 10 };
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (cursorToFetch) params.cursor = cursorToFetch;
    const response = await adminVocabApi.getAll(params);
    if (cursorToFetch) setVocabs((prev) => [...prev, ...response.data]);
    else setVocabs(response.data);
    setNextCursor(response.nextCursor);
    setHasMore(response.hasMore);
  },
  [debouncedKeyword],
);
```

**Ưu điểm**: Hiệu năng ổn định với dữ liệu lớn, tránh "phantom row" khi dữ liệu thay đổi giữa các trang.

### 3.5 Debounce Search — URL Sync

`VocabManagePage` đồng bộ keyword tìm kiếm vào URL (`?keyword=...`) để có thể bookmark và chia sẻ:

```javascript
const [inputValue, setInputValue] = useState(urlKeyword); // Hiển thị ngay
const debouncedKeyword = useDebounce(inputValue, 500); // Gọi API sau 500ms

useEffect(() => {
  // Đồng bộ URL
  debouncedKeyword
    ? searchParams.set("keyword", debouncedKeyword)
    : searchParams.delete("keyword");
  setSearchParams(searchParams);
  fetchVocabularies(null); // Reset về trang đầu mỗi khi search thay đổi
}, [debouncedKeyword]);
```

### 3.6 Composable Providers — Chống Provider Hell

```javascript
// composeProviders.jsx
export function composeProviders(...providers) {
  return ({ children }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children,
    );
}

// AppProviders.jsx
export const ClientProviders = composeProviders(
  UserAuthProvider,
  VocabProvider,
  QuoteProvider,
  CategoryProvider,
);
export const AdminProviders = composeProviders(
  AdminAuthProvider,
  VocabTagsProvider,
  QuoteTagsProvider,
  RoleProvider,
);
```

---

## 4. Quy Ước Code & API

### 4.1 Cấu trúc Response API (Backend trả về)

```javascript
// Danh sách thông thường (có phân trang offset)
{ data: [...], total: 100, page: 1, limit: 10 }

// Danh sách với cursor pagination (Vocab, Quote)
{ data: [...], nextCursor: 'uuid-abc', hasMore: true }

// Thao tác CRUD thành công
{ message: 'Success', data: { ...item } }

// Lỗi
{ message: 'Error description', statusCode: 400 }
```

### 4.2 Pattern Chuẩn Khi Kết Nối API trong Page

```javascript
// Mẫu cho các page cần fetch danh sách + CRUD (AdminManagePage, UserManagePage,...)
const [items, setItems] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const fetchItems = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await someApi.getAll();
    setItems(response?.data || []);
  } catch (error) {
    toast.error(error.message || "Lỗi khi tải dữ liệu!");
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchItems();
}, [fetchItems]);

const handleSave = async (form) => {
  try {
    setIsSaving(true);
    if (modal?.id) await someApi.update(modal.id, form);
    else await someApi.create(form);
    toast.success("Lưu thành công!");
    setModal(null);
    fetchItems();
  } catch (error) {
    toast.error(error.message || "Lỗi khi lưu!");
  } finally {
    setIsSaving(false);
  }
};
```

### 4.3 Thêm API Mới

Mọi API call mới đều phải đặt trong đúng file:

- **Admin**: `src/apis/admin/index.js` — dùng `request` (public) hoặc `requestAuthorized` (cần auth)
- **Client**: `src/apis/client/index.js` — dùng `request` hoặc `requestAuthorizedClient`

```javascript
// Ví dụ thêm adminDashboardApi vào src/apis/admin/index.js:
export const adminDashboardApi = {
  getStats: () => requestAuthorized("GET", "/admin/dashboard/stats"),
  getRecentActivity: () =>
    requestAuthorized("GET", "/admin/dashboard/recent-activity"),
};
```

---

## 5. UI/UX & Design System

- **Tailwind CSS v4**: Engine mới, biên dịch nhanh hơn, tích hợp trực tiếp vào Vite
- **Shadcn/ui & Radix UI**: Toàn bộ modal, dialog, select, table — tuân thủ WAI-ARIA
- **Color System**: `CATEGORY_COLORS` và `TAG_COLORS` trong `utils/constants.js`
- **Toast Notifications**: `react-toastify` — dùng `toast.success()` / `toast.error()` nhất quán
- **Loading States**:
  - Spinner overlay (`<Loader2 className="animate-spin" />`) cho table đang tải
  - `disabled={isSaving}` / `disabled={isDeleting}` cho buttons trong modal
  - `ConfirmDialog` với `isLoading` prop cho xác nhận xóa

---

## 6. Thứ Tự Ưu Tiên Công Việc (Priority Roadmap)

### 🔴 Cao — Ảnh hưởng trực tiếp đến UX người dùng

1. **`ProfilePage` (Client)**: Kết nối `UserAuthContext` + `authUserApi.updateMe`
2. **`VocabularyPage` (Client)**: Thay MOCK_VOCABS bằng `vocabApi.getAll()`
3. **`QuotesPage` (Client)**: Thay MOCK_QUOTES bằng `quoteApi.getAll()`

### 🟡 Trung — Ảnh hưởng đến chức năng Admin

4. **`AdminManagePage`**: Kết nối `adminAccountApi` (CRUD admins)
5. **`UserManagePage`**: Kết nối `userAccountApi` (fetch + update users)
6. **`PermissionsPage`**: Kết nối `permissionApi.getMatrix()` + `permissionApi.save()`

### 🟢 Thấp — Nice-to-have

7. **`DashboardPage`**: API thống kê thật + thư viện biểu đồ (recharts)
8. **`HomePage` (Client)**: API stats cá nhân user (streak, từ đã học, sao)
9. **Xóa `mockData.js`**: Sau khi tất cả pages đã kết nối API thật

---

## 7. Định Hướng Kỹ Thuật Dài Hạn

1. **TypeScript Migration**: Các type `@types/react`, `@types/react-dom`, `@types/node` đã có sẵn trong `package.json` — sẵn sàng chuyển sang `.tsx`
2. **React Query / TanStack Query**: Thay thế pattern `useEffect + useState` cho data fetching — tự động caching, refetch on focus, optimistic updates
3. **Code Splitting**: `React.lazy` + `Suspense` cho tất cả route pages — giảm initial bundle size
4. **React Compiler (Babel Plugin)**: `babel-plugin-react-compiler` đã được tích hợp — auto-memoize, không cần `useMemo`/`useCallback` thủ công
