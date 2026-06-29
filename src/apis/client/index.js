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
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request('GET', `/vocabularies${queryString}`)
  },
  getOne: (id) => request('GET', `/vocabularies/${id}`),
  getAllTags: () => requestAuthorizedClient('GET', '/tags?type=VOCAB'), // Lấy danh sách tags dùng filter category
}

export const quoteApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request('GET', `/quotes${queryString}`)
  },
  getOne: (id) => request('GET', `/quotes/${id}`),
  getToday: () => request('GET', '/quotes/today'),     // Câu nói hôm nay
  getAllTags: () => requestAuthorizedClient('GET', '/tags?type=QUOTE'),      // Danh sách tags để filter
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

export const userDashboardApi = {
  getDashboard: () => requestAuthorizedClient('GET', '/home/dashboard'),
};

export const progressApi = {
  learnWord: (data) => requestAuthorizedClient('POST', '/home/progress/learn', data),
  getMasteredIds: () => requestAuthorizedClient('GET', '/home/progress/mastered'),
};

