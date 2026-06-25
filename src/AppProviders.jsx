import { AdminAuthProvider } from '@/contexts/admin/AdminAuthContext'
import { UserAuthProvider } from '@/contexts/UserAuthContext'
import { VocabProvider } from '@/contexts/VocabContext'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import { composeProviders } from './composeProviders'

// 1. Nhóm Global: Các Provider dùng chung cho cả Client lẫn Admin
const GlobalProvidersComposer = composeProviders(
  VocabProvider,
  QuoteProvider,
  CategoryProvider
)
export function GlobalProviders({ children }) {
  return <GlobalProvidersComposer>{children}</GlobalProvidersComposer>
}

// 2. Nhóm Client: Bọc các trang người dùng — bao gồm cả UserAuthProvider
const ClientProvidersComposer = composeProviders(
  UserAuthProvider
)
export function ClientProviders({ children }) {
  return <ClientProvidersComposer>{children}</ClientProvidersComposer>
}

// 3. Nhóm Admin: Chỉ bọc các trang quản trị
const AdminProvidersComposer = composeProviders(
  AdminAuthProvider
)
export function AdminProviders({ children }) {
  return <AdminProvidersComposer>{children}</AdminProvidersComposer>
}
