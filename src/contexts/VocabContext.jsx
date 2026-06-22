import { createContext, useContext, useReducer } from 'react'
import { vocabReducer } from '@/reducers/vocabReducer'
import { MOCK_VOCABS } from '@/utils/mockData'

const VocabContext = createContext(null)

export function VocabProvider({ children }) {
  const [state, dispatch] = useReducer(vocabReducer, { vocabs: MOCK_VOCABS })

  const addVocab    = (data)     => dispatch({ type: 'ADD',    payload: data })
  const updateVocab = (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } })
  const deleteVocab = (id)       => dispatch({ type: 'DELETE', payload: id })

  return (
    <VocabContext.Provider value={{ vocabs: state.vocabs, addVocab, updateVocab, deleteVocab }}>
      {children}
    </VocabContext.Provider>
  )
}

export const useVocab = () => useContext(VocabContext)