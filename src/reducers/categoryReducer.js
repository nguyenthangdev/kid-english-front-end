export const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, categories: [...state.categories, { ...action.payload, id: Date.now().toString(), count: 0 }] }
    case 'UPDATE':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload.data } : c) }
    case 'DELETE':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) }
    default:
      return state
  }
}