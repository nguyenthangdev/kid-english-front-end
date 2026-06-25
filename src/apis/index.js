import { API_ROOT } from "@/utils"
import axios from 'axios'
import authorizedAxiosAdmin from '@/utils/authorizedAxiosAdmin'
import authorizedAxiosClient from '@/utils/authorizedAxiosClient'

const request = async (method, path, data) => {
  const res = await axios({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })
  return res.data
}

// Dùng cho Admin: kèm JWT interceptor + silent refresh của admin
const requestAuthorized = async (method, path, data) => {
  const res = await authorizedAxiosAdmin({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })
  return res.data
}

// Dùng cho Client/User: kèm JWT interceptor + silent refresh của user
const requestAuthorizedClient = async (method, path, data) => {
  const res = await authorizedAxiosClient({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })
  return res.data
}

export const vocabApi = {
  getAll: () => request('GET', '/vocabs'),
  getOne: (id) => request('GET', `/vocabs/${id}`),
  create: (data) => request('POST', '/vocabs', data),
  update: (id, data) => request('PATCH', `/vocabs/${id}`, data),
  remove: (id) => request('DELETE', `/vocabs/${id}`),
}

export const quoteApi = {
  getAll: () => request('GET', '/quotes'),
  getOne: (id) => request('GET', `/quotes/${id}`),
  create: (data) => request('POST', '/quotes', data),
  update: (id, data) => request('PATCH', `/quotes/${id}`, data),
  remove: (id) => request('DELETE', `/quotes/${id}`),
}

export const vocabCategoryApi = {
  getAll: () => request('GET', '/vocab-category'),
  create: (data) => request('POST', '/vocab-category', data),
  update: (id, data) => request('PATCH', `/vocab-category/${id}`, data),
  remove: (id) => request('DELETE', `/vocab-category/${id}`),
}

export const quoteCategoryApi = {
  getAll: () => request('GET', '/quote-category'),
  create: (data) => request('POST', '/quote-category', data),
  update: (id, data) => request('PATCH', `/quote-category/${id}`, data),
  remove: (id) => request('DELETE', `/quote-category/${id}`),
}

export const authAdminApi = {
  loginAdmin: (data) => request('POST', '/admin/auth/login', data),
  logoutAdmin: () => request('POST', '/admin/auth/logout'),
  registerAdmin: (data) => request('POST', '/admin/auth/register', data),
  refreshTokenAdmin: () => request('POST', '/admin/auth/refresh-token'),
  me: () => requestAuthorized('GET', '/admin/me'),
  updateMe: (data) => requestAuthorized('PATCH', '/admin/me', data),
  changePassword: (data) => requestAuthorized('PATCH', '/admin/me/password', data),
  uploadAvatar: (data) => requestAuthorized('POST', '/admin/me/avatar', data),
}

export const adminApi = {
  getAll: () => request('GET', '/admins'),
  create: (data) => request('POST', '/admins', data),
  update: (id, data) => request('PATCH', `/admins/${id}`, data),
  remove: (id) => request('DELETE', `/admins/${id}`),
}

export const userApi = {
  getAll: () => request('GET', '/users'),
  update: (id, data) => request('PATCH', `/users/${id}`, data),
}

export const roleApi = {
  getAll: () => request('GET', '/roles'),
  create: (data) => request('POST', '/roles', data),
  update: (id, data) => request('PATCH', `/roles/${id}`, data),
  remove: (id) => request('DELETE', `/roles/${id}`),
}

export const permissionApi = {
  getMatrix: () => request('GET', '/permissions/matrix'),
  save: (data) => request('POST', '/permissions/matrix', data),
}

export const authUserApi = {
  // Public endpoints (không cần token)
  login: (data) => request('POST', '/user/auth/login', data),
  register: (data) => request('POST', '/user/auth/register', data),
  logout: () => request('POST', '/user/auth/logout'),
  refreshToken: () => request('POST', '/user/auth/refresh-token'),

  // Protected endpoints (cần token → dùng authorizedAxiosClient)
  me: () => requestAuthorizedClient('GET', '/user/auth/me'),
  updateMe: (data) => requestAuthorizedClient('PATCH', '/user/auth/me', data),
  changePassword: (data) => requestAuthorizedClient('PATCH', '/user/auth/me/password', data),
  uploadAvatar: (data) => requestAuthorizedClient('POST', '/user/auth/me/avatar', data),
}
