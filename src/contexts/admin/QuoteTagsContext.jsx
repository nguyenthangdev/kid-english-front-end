/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext, useCallback } from 'react'
import { quoteTagsApi } from '@/apis/admin/index'
import { toast } from 'react-toastify'
import { adminQuoteTagsReducer, quoteTagsInitialState } from '@/reducers/admin/adminQuoteTagsReducer'

const QuoteTagsContext = createContext()

export function QuoteTagsProvider({ children }) {
  const [state, dispatch] = useReducer(adminQuoteTagsReducer, quoteTagsInitialState)

  const fetchTags = useCallback(async (forceRefetch = false) => {
    // Bỏ qua nếu đã fetch xong và không có lệnh ép buộc fetch lại
    if (state.isFetched && !forceRefetch) return

    dispatch({ type: 'FETCH_START' })
    try {
      // Vì đây là Context cung cấp data cho Dropdown, ta cần truyền limit lớn để lấy đủ thẻ
      const response = await quoteTagsApi.getAll()
      console.log('response from quote: ', response)
      // Bóc tách dữ liệu theo chuẩn NestJS trả về (CursorPaginatedResult)
      const tagsData = response?.data || []

      dispatch({ type: 'FETCH_SUCCESS', payload: tagsData })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
      toast.error(error.message || 'Lỗi khi tải danh sách thẻ trích dẫn')
    }
  }, [state.isFetched])

  return (
    <QuoteTagsContext.Provider value={{ state, fetchTags }}>
      {children}
    </QuoteTagsContext.Provider>
  )
}

export const useQuoteTags = () => useContext(QuoteTagsContext)