import { AdminAuthProvider } from '@/contexts/admin/AdminAuthContext'
import { VocabProvider } from '@/contexts/VocabContext'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import { composeProviders } from './composeProviders'
import { VocabTagsProvider } from './contexts/admin/VocabTagsContext'
import { QuoteTagsProvider } from './contexts/admin/QuoteTagsContext'

// 1. Nhóm Global: Các Provider dùng chung cho cả Client lẫn Admin
export const GlobalProviders = composeProviders(
  VocabProvider,
  QuoteProvider,
  CategoryProvider
)

// 2. Nhóm Client: Chỉ bọc các trang người dùng
export const ClientProviders = composeProviders(
  // AuthProvider
)

// 3. Nhóm Admin: Chỉ bọc các trang quản trị
export const AdminProviders = composeProviders(
  AdminAuthProvider,
  VocabTagsProvider,
  QuoteTagsProvider
)