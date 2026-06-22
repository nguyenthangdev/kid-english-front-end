import { createContext, useContext, useReducer } from 'react'
import { authReducer } from '@/reducers/authReducer'

const AuthContext     = createContext(null)
const AdminAuthContext = createContext(null)

const initialState = { user: null, token: null, isAuthenticated: false }

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login  = (user, token) => dispatch({ type: 'LOGIN',  payload: { user, token } })
  const logout = ()            => dispatch({ type: 'LOGOUT' })

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AdminAuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login  = (user, token) => dispatch({ type: 'LOGIN',  payload: { user, token } })
  const logout = ()            => dispatch({ type: 'LOGOUT' })

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAuth      = () => useContext(AuthContext)
export const useAdminAuth = () => useContext(AdminAuthContext)