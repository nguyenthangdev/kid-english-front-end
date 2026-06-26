import { AdminAuthProvider } from '@/contexts/admin/AdminAuthContext'
import { UserAuthProvider } from '@/contexts/client/UserAuthContext'
import { composeProviders } from './composeProviders'
import { VocabTagsProvider } from '@/contexts/admin/VocabTagsContext'
import { QuoteTagsProvider } from '@/contexts/admin/QuoteTagsContext'
import { RoleProvider } from '@/contexts/admin/RoleContext'
import { VocabProvider } from '@/contexts/VocabContext'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { CategoryProvider } from '@/contexts/CategoryContext'

export const GlobalProviders = composeProviders(
  VocabProvider,
  QuoteProvider,
  CategoryProvider
)

export const ClientProviders = composeProviders(
  UserAuthProvider
)

export const AdminProviders = composeProviders(
  AdminAuthProvider,
  VocabTagsProvider,
  QuoteTagsProvider,
  RoleProvider
)
