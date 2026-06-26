/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'
import { quoteReducer } from '@/reducers/quoteReducer'
import { MOCK_QUOTES } from '@/utils/mockData'

const QuoteContext = createContext(null)

export function QuoteProvider({ children }) {
  const [state, dispatch] = useReducer(quoteReducer, { quotes: MOCK_QUOTES })

  const addQuote    = (data)     => dispatch({ type: 'ADD',      payload: data })
  const updateQuote = (id, data) => dispatch({ type: 'UPDATE',   payload: { id, data } })
  const deleteQuote = (id)       => dispatch({ type: 'DELETE',   payload: id })
  const setToday    = (id)       => dispatch({ type: 'SET_TODAY', payload: id })

  return (
    <QuoteContext.Provider value={{ quotes: state.quotes, addQuote, updateQuote, deleteQuote, setToday }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => useContext(QuoteContext)