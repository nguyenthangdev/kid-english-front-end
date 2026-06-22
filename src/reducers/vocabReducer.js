export const vocabReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, vocabs: [...state.vocabs, { ...action.payload, id: Date.now().toString() }] }
    case 'UPDATE':
      return { ...state, vocabs: state.vocabs.map(v => v.id === action.payload.id ? { ...v, ...action.payload.data } : v) }
    case 'DELETE':
      return { ...state, vocabs: state.vocabs.filter(v => v.id !== action.payload) }
    default:
      return state
  }
}