import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ClientProviders, AdminProviders } from './AppProviders'
// import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import PrivateRouteAdmin from '@/components/admin/PrivateRoute'
import UnauthorizedRoutesAdmin from '@/components/admin/UnauthorizedRoutes'
import {
  LoginPage, RegisterPage, HomePage, VocabularyPage, QuotesPage, ProfilePage,
  AdminLoginPage, DashboardPage, VocabManagePage, QuoteManagePage,
  VoCabTagsManagePage, AdminManagePage, UserManagePage, RoleManagePage,
  PermissionsPage, AdminProfilePage, AdminSettingsPage, QuoteTagsManagePage
} from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/" element={
        <ClientProviders>
          <Outlet /> 
        </ClientProviders>
      }>
        <Route path="home"       element={<HomePage />} />
        <Route path="vocabulary" element={<VocabularyPage />} />
        <Route path="quotes"     element={<QuotesPage />} />
        <Route path="profile"    element={<ProfilePage />} /> 
      </Route>

      <Route path="/" element={
        <ClientProviders>
          <Outlet />
        </ClientProviders>
      }>
        <Route path="login"    element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin/auth" element={
        <AdminProviders>
          <UnauthorizedRoutesAdmin />
        </AdminProviders>
      }>
        <Route path="login" element={<AdminLoginPage />} />
      </Route>


      <Route path="/admin" element={
        <AdminProviders>
          <PrivateRouteAdmin>
            <AdminLayout />
          </PrivateRouteAdmin>
        </AdminProviders>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="vocabulary"  element={<VocabManagePage />} />
        <Route path="quotes"      element={<QuoteManagePage />} />
        <Route path="vocab-tags"  element={<VoCabTagsManagePage />} />
        <Route path="quote-tags"  element={<QuoteTagsManagePage />} />
        <Route path="admins"      element={<AdminManagePage />} />
        <Route path="users"       element={<UserManagePage />} />
        <Route path="roles"       element={<RoleManagePage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="profile"     element={<AdminProfilePage />} />
        <Route path="settings"    element={<AdminSettingsPage />} />
      </Route>

    </Routes>
  )
}
