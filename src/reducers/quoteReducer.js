export const quoteReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, quotes: [...state.quotes, { ...action.payload, id: Date.now().toString(), isToday: false }] }
    case 'UPDATE':
      return { ...state, quotes: state.quotes.map(q => q.id === action.payload.id ? { ...q, ...action.payload.data } : q) }
    case 'DELETE':
      return { ...state, quotes: state.quotes.filter(q => q.id !== action.payload) }
    case 'SET_TODAY':
      return { ...state, quotes: state.quotes.map(q => ({ ...q, isToday: q.id === action.payload })) }
    default:
      return state
  }
}