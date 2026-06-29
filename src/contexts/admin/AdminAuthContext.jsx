/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react'
import { adminAuthApi, adminProfileApi } from '@/apis/admin'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

const AdminAuthContext = createContext(undefined)

export const AdminAuthProvider = ({ children }) => {
  const [accountAdmin, setAccountAdmin] = useState(null)
  const [role, setRole] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await adminProfileApi.getProfile()
        const responseData = response.data
        if (responseData && responseData.accountAdmin) {
          setAccountAdmin(responseData.accountAdmin)
          setRole(responseData.role || null)
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
      toast.error(error.response.data.message)
    } finally {
      setAccountAdmin(null)
      setRole(null)
      setAuthChecked(true)
    }

    return response
  }

  const refreshUser = async () => {
    let response = null
    try {
      response = await adminProfileApi.getProfile()
      const responseData = response.data
      if (responseData && responseData.accountAdmin) {
        setAccountAdmin(responseData.accountAdmin)
        setRole(responseData.role || null)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }

    return response
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
