import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ClientProviders, AdminProviders } from './AppProviders'
// import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import PrivateRouteAdmin from '@/components/admin/PrivateRoute'
import UnauthorizedRoutesAdmin from '@/components/admin/UnauthorizedRoutes'
import PrivateRouteUser from '@/components/client/PrivateRoute'
import UnauthorizedRoutesUser from '@/components/client/UnauthorizedRoutes'
import {
  LoginPage, RegisterPage, HomePage, VocabularyPage, QuotesPage, ProfilePage,
  AdminLoginPage, DashboardPage, VocabManagePage, QuoteManagePage,
  CategoryManagePage, AdminManagePage, UserManagePage, RoleManagePage,
  PermissionsPage, AdminProfilePage, AdminSettingsPage,
} from '@/pages'

export default function App() {
  return (
    <Routes>
      {/* ══════════════════════════════════════════════════════════════
          CLIENT: Bọc 1 lần duy nhất bằng ClientProviders
          → UserAuthProvider chỉ mount 1 lần, state chia sẻ giữa
            UnauthorizedRoutesUser và PrivateRouteUser
         ══════════════════════════════════════════════════════════════ */}
      <Route element={<ClientProviders><Outlet /></ClientProviders>}>
        {/* Trang auth (login/register) — redirect nếu đã đăng nhập */}
        <Route element={<UnauthorizedRoutesUser />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Trang yêu cầu đăng nhập */}
        <Route element={
          <PrivateRouteUser>
            <Outlet />
          </PrivateRouteUser>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="quotes" element={<QuotesPage />} />
        </Route>
      </Route>

      {/* ══════════════════════════════════════════════════════════════
          ADMIN: Giữ nguyên cấu trúc — AdminProviders bọc riêng
         ══════════════════════════════════════════════════════════════ */}
      {/* Trang auth (chỉ truy cập khi chưa đăng nhập) */}
      <Route path="/admin/auth" element={
        <AdminProviders>
          <UnauthorizedRoutesAdmin />
        </AdminProviders>
      }>
        <Route path="login" element={<AdminLoginPage />} />
      </Route>

      {/* Trang quản trị (yêu cầu đăng nhập admin) */}
      <Route path="/admin" element={
        <AdminProviders>
          <PrivateRouteAdmin>
            <AdminLayout />
          </PrivateRouteAdmin>
        </AdminProviders>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="vocabulary" element={<VocabManagePage />} />
        <Route path="quotes" element={<QuoteManagePage />} />
        <Route path="vocab-tags" element={<CategoryManagePage />} />
        <Route path="admins" element={<AdminManagePage />} />
        <Route path="users" element={<UserManagePage />} />
        <Route path="roles" element={<RoleManagePage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

    </Routes>
  )
}
