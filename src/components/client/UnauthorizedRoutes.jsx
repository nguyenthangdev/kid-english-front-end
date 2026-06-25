import { Navigate, Outlet } from 'react-router-dom'
import { useUserAuth } from '@/contexts/UserAuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Bảo vệ các trang public (login, register).
 * Nếu user đã đăng nhập → redirect thẳng về /home, ngăn đăng nhập lặp lại.
 */
const UnauthorizedRoutesUser = () => {
  const { isAuthenticated, isLoading, authChecked } = useUserAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />
  }

  return <Outlet />
}

export default UnauthorizedRoutesUser
