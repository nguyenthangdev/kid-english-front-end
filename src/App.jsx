import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AdminAuthProvider } from '@/contexts/AuthContext'
import { VocabProvider } from '@/contexts/VocabContext'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import {
  LoginPage, RegisterPage, HomePage, VocabularyPage, QuotesPage, ProfilePage,
  AdminLoginPage, DashboardPage, VocabManagePage, QuoteManagePage,
  CategoryManagePage, AdminManagePage, UserManagePage, RoleManagePage,
  PermissionsPage, AdminProfilePage,
} from '@/pages'

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <VocabProvider>
          <QuoteProvider>
            <CategoryProvider>
              <BrowserRouter>
                <Routes>
                  {/* Redirect gốc */}
                  <Route path="/" element={<Navigate to="/home" replace />} />

                  {/* Auth client */}
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Client layout */}
                  <Route element={<ClientLayout />}>
                    <Route path="/home"       element={<HomePage />} />
                    <Route path="/vocabulary" element={<VocabularyPage />} />
                    <Route path="/quotes"     element={<QuotesPage />} />
                    <Route path="/profile"    element={<ProfilePage />} />
                  </Route>

                  {/* Auth admin */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Admin layout */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard"   element={<DashboardPage />} />
                    <Route path="vocabulary"  element={<VocabManagePage />} />
                    <Route path="quotes"      element={<QuoteManagePage />} />
                    <Route path="vocab-tags"  element={<CategoryManagePage />} />
                    <Route path="admins"      element={<AdminManagePage />} />
                    <Route path="users"       element={<UserManagePage />} />
                    <Route path="roles"       element={<RoleManagePage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="profile"     element={<AdminProfilePage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CategoryProvider>
          </QuoteProvider>
        </VocabProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}