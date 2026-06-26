/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext, useCallback } from 'react'
import { vocabTagsApi } from '@/apis/admin/index'
import { toast } from 'react-toastify'
import { adminVocabTagsReducer, initialState } from '@/reducers/admin/adminVocabTagsReducer'

const VocabTagsContext = createContext()

export function VocabTagsProvider({ children }) {
  const [state, dispatch] = useReducer(adminVocabTagsReducer, initialState)

  // Hàm lấy data: Có thêm tham số forceRefetch để ép gọi lại API sau khi thêm/sửa/xóa
  const fetchTags = useCallback(async (forceRefetch = false) => {
    if (state.isFetched && !forceRefetch) return

    dispatch({ type: 'FETCH_START' })
    try {
      const response = await vocabTagsApi.getAll()
      const data = response.data
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
      toast.error(error.message || 'Lỗi khi tải danh sách thẻ')
    }
  }, [state.isFetched])

  return (
    <VocabTagsContext.Provider value={{ state, fetchTags }}>
      {children}
    </VocabTagsContext.Provider>
  )
}

export const useVocabTags = () => useContext(VocabTagsContext)