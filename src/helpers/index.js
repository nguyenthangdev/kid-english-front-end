export const getInitial = (name = '') => name.charAt(0).toUpperCase()

export const truncate = (str = '', max = 60) =>
  str.length > max ? str.slice(0, max) + '...' : str

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('vi-VN')