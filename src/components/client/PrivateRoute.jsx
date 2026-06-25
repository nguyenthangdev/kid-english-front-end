import { Navigate } from 'react-router-dom'
import { useUserAuth } from '@/contexts/UserAuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Bảo vệ các trang yêu cầu đăng nhập (profile, lịch sử học,...).
 * Hiển thị spinner khi đang xác thực, redirect về /login nếu chưa đăng nhập.
 */
const PrivateRouteUser = ({ children }) => {
  const { isAuthenticated, isLoading, authChecked } = useUserAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />
  }

  return children
}

export default PrivateRouteUser
