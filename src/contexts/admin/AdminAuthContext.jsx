/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react'
import { adminAuthApi } from '@/apis/admin/index'
import { Loader2 } from 'lucide-react'

const AdminAuthContext = createContext(undefined)

export const AdminAuthProvider = ({ children }) => {
  const [accountAdmin, setAccountAdmin] = useState(null)
  const [role, setRole] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await adminAuthApi.me()
        
        if (response && response.accountAdmin) {
          setAccountAdmin(response.accountAdmin)
          setRole(response.role || null)
        } else {
          setAccountAdmin(null)
          setRole(null)
        }
      } catch (error) {
        setAccountAdmin(null)
        setRole(null)
      } finally {
        setAuthChecked(true)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // 2. Lắng nghe sự kiện ép đăng xuất (thường dùng ở Axios Interceptors khi bị 401)
  useEffect(() => {
    const handleForceLogout = () => {
      setAccountAdmin(null)
      setRole(null)
      setAuthChecked(true)
    }

    window.addEventListener('force-logout', handleForceLogout)
    return () => window.removeEventListener('force-logout', handleForceLogout)
  }, [])

  const login = (userData, roleData = null) => {
    setAccountAdmin(userData)
    if (roleData) setRole(roleData)
    setAuthChecked(true)
  }

  const logout = async () => {
    let response = null

    try {
      response = await adminAuthApi.logoutAdmin()
    } catch (error) {
      console.error('Lỗi khi logout:', error)
    } finally {
      setAccountAdmin(null)
      setRole(null)
      setAuthChecked(true)
    }

    return response
  }

  const refreshUser = async () => {
    try {
      const response = await adminAuthApi.me()
      if (response && response.accountAdmin) {
        setAccountAdmin(response.accountAdmin)
        setRole(response.role || null)
      }
    } catch (error) {
      console.error('Lỗi khi refresh user:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const value = {
    accountAdmin,
    admin: accountAdmin,
    role,
    isLoading,
    authChecked,
    isAuthenticated: authChecked && !!accountAdmin,
    login,
    logout,
    refreshUser
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth phải được sử dụng bên trong AdminAuthProvider')
  }
  return context
}
