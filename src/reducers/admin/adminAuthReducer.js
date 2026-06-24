export const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    default:
      return state
  }
}