/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext, useCallback } from 'react'
import { adminRoleApi } from '@/apis/admin/index'
// import { toast } from 'react-toastify'
import { adminRoleReducer, roleInitialState } from '@/reducers/admin/adminRoleReducer'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [state, dispatch] = useReducer(adminRoleReducer, roleInitialState)

  const fetchRoles = useCallback(async (forceRefetch = false) => {
    // Bỏ qua nếu đã fetch xong và không có lệnh ép buộc fetch lại
    if (state.isFetched && !forceRefetch) return

    dispatch({ type: 'FETCH_START' })
    try {
      const response = await adminRoleApi.getAll()
      console.log('response: ', response)
      const payload = response?.data

      dispatch({ type: 'FETCH_SUCCESS', payload: payload })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
      // toast.error(error.message || 'Lỗi khi tải danh sách nhóm quyền')
    }
  }, [state.isFetched])

  return (
    <RoleContext.Provider value={{ state, fetchRoles }}>
      {children}
    </RoleContext.Provider>
  )
}

// Custom hook để gọi nhanh ở các trang khác
export const useRoles = () => useContext(RoleContext)