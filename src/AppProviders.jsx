import { AdminAuthProvider } from '@/contexts/admin/AdminAuthContext'
import { UserAuthProvider } from '@/contexts/client/UserAuthContext'
import { composeProviders } from './composeProviders'
import { VocabTagsProvider } from '@/contexts/admin/VocabTagsContext'
import { QuoteTagsProvider } from '@/contexts/admin/QuoteTagsContext'
import { RoleProvider } from '@/contexts/admin/RoleContext'

// -- CONTEXT CŨ: đã được thay thế bằng API calls trực tiếp trong từng page --
// import { VocabProvider }    from '@/contexts/VocabContext'
// import { QuoteProvider }    from '@/contexts/QuoteContext'
// import { CategoryProvider } from '@/contexts/CategoryContext'
// GlobalProviders không còn cần thiết — client pages tự fetch data qua API

export const ClientProviders = composeProviders(
  UserAuthProvider
)

export const AdminProviders = composeProviders(
  AdminAuthProvider,
  VocabTagsProvider,
  QuoteTagsProvider,
  RoleProvider
)
