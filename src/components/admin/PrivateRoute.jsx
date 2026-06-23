import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext' 
import { Loader2 } from 'lucide-react'

const PrivateRouteAdmin = ({ children }) => {
  const { isAuthenticated, isLoading, authChecked } = useAdminAuth() 

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth/login" replace={true}/>
  }
  
  return children
}

export default PrivateRouteAdmin