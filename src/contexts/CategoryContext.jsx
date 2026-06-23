/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'
import { categoryReducer } from '@/reducers/categoryReducer'
import { MOCK_CATEGORIES } from '@/utils/mockData'

const CategoryContext = createContext(null)

export function CategoryProvider({ children }) {
  const [state, dispatch] = useReducer(categoryReducer, { categories: MOCK_CATEGORIES })

  const addCategory    = (data)     => dispatch({ type: 'ADD',    payload: data })
  const updateCategory = (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } })
  const deleteCategory = (id)       => dispatch({ type: 'DELETE', payload: id })

  return (
    <CategoryContext.Provider value={{ categories: state.categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = () => useContext(CategoryContext)