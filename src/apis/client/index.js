import { API_ROOT } from "@/utils"
import axios from 'axios'
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
}

export const quoteApi = {
  getAll: () => request('GET', '/quotes'),
  getOne: (id) => request('GET', `/quotes/${id}`),
}

export const authUserApi = {
  login: (data) => request('POST', '/user/auth/login', data),
  register: (data) => request('POST', '/user/auth/register', data),
  logout: () => request('POST', '/user/auth/logout'),
  refreshToken: () => request('POST', '/user/auth/refresh-token'),

  me: () => requestAuthorizedClient('GET', '/user/auth/me'),
  updateMe: (data) => requestAuthorizedClient('PATCH', '/user/auth/me', data),
  changePassword: (data) => requestAuthorizedClient('PATCH', '/user/auth/me/password', data),
  uploadAvatar: (data) => requestAuthorizedClient('POST', '/user/auth/me/avatar', data),
}
