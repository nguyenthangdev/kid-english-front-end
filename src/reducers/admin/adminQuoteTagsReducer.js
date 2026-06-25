export const quoteTagsInitialState = {
  tags: [],
  isLoading: false,
  error: null,
  isFetched: false,
}

export function adminQuoteTagsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, tags: action.payload, isFetched: true }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    default:
      return state
  }
}