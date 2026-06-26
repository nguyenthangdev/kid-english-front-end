/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { authUserApi } from '@/apis/client/index'
import { Loader2 } from 'lucide-react'

const UserAuthContext = createContext(undefined)

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

 useEffect(() => {
  const initAuth = async () => {
    try {
      const response = await authUserApi.me()
      const userData = response?.user 
      
      if (userData && userData.email) {
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.log('error: ', error)
      setUser(null)
    } finally {
      setAuthChecked(true)
      setIsLoading(false)
    }
  }

  initAuth()
}, [])

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null)
      setAuthChecked(true)
    }

    window.addEventListener('force-logout-user', handleForceLogout)
    return () => window.removeEventListener('force-logout-user', handleForceLogout)
  }, [])

const login = (userData) => {
  setUser(userData)
  setAuthChecked(true)
}

const logout = async () => {
  let response = null
  try {
    response = await authUserApi.logout()
  } catch (error) {
    console.error('Lỗi khi logout:', error)
  } finally {
    setUser(null)
    setAuthChecked(true)
  }
  return response
}

// Dùng để refresh lại thông tin user sau khi update profile/avatar
const refreshUser = async () => {
  try {
    const response = await authUserApi.me()
    const userData = response?.user ?? response?.data?.user ?? response?.data
    if (userData) {
      setUser(userData)
    }
  } catch (error) {
    console.error('Lỗi khi refresh user:', error)
  }
}

if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  )
}

const value = {
  user,
  isLoading,
  authChecked,
  isAuthenticated: authChecked && !!user,
  login,
  logout,
  refreshUser,
}

return (
  <UserAuthContext.Provider value={value}>
    {children}
  </UserAuthContext.Provider>
)
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (!context) {
    throw new Error('useUserAuth phải được sử dụng bên trong UserAuthProvider')
  }
  return context
}
