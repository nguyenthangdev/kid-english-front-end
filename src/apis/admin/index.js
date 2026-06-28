import { API_ROOT } from "@/utils"
import axios from 'axios'
import authorizedAxiosAdmin from '@/utils/authorizedAxiosAdmin'

const request = async (method, path, data) => {
  const res = await axios({
    method,
    url: `${API_ROOT}${path}`,
    data, 
    withCredentials: true,
  });
  return res.data;
}

const requestAuthorized = async (method, path, data) => {
  const res = await authorizedAxiosAdmin({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })

  return res.data
}

export const adminVocabApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request('GET', `/admin/vocabularies${queryString}`);
  },
  getOne:  (id)       => request('GET',    `/admin/vocabularies/${id}`),
  create:  (data)     => request('POST',   '/admin/vocabularies', data),
  update:  (id, data) => request('PATCH',  `/admin/vocabularies/${id}`, data),
  remove:  (id)       => request('DELETE', `/admin/vocabularies/${id}`),
  uploadImage: (formData) => request('POST', '/admin/vocabularies/upload-image', formData, {}),
}

export const adminQuoteApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request('GET', `/admin/quotes${queryString}`);
  },
  getOne:  (id)       => request('GET',    `/admin/quotes/${id}`),
  create:  (data)     => request('POST',   '/admin/quotes', data),
  update:  (id, data) => request('PATCH',  `/admin/quotes/${id}`, data),
  remove:  (id)       => request('DELETE', `/admin/quotes/${id}`),
}

export const vocabTagsApi = {
  getAll: (params) => {
    const finalParams = { type: 'VOCAB', ...params };
    const queryString = new URLSearchParams(finalParams).toString();
    return requestAuthorized('GET', `/admin/tags?${queryString}`);
  },
  create:  (data)     => requestAuthorized('POST',   '/admin/tags', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/tags/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/tags/${id}`),
}

export const quoteTagsApi = {
  getAll: (params) => {
    const finalParams = { type: 'QUOTE', ...params }
    const queryString = new URLSearchParams(finalParams).toString()
    return requestAuthorized('GET', `/admin/tags?${queryString}`) 
  },
  create:  (data)     => requestAuthorized('POST',   '/admin/tags', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/tags/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/tags/${id}`),
}

export const adminAuthApi = {
  loginAdmin:         (data) => request('POST', '/admin/auth/login', data),
  logoutAdmin:        ()     => request('POST', '/admin/auth/logout'),
  registerAdmin:      (data) => request('POST', '/admin/auth/register', data),
  refreshTokenAdmin:  ()     => request('POST', '/admin/auth/refresh-token'),
  me:                 ()     => requestAuthorized('GET',  '/admin/me'),
  updateMe:           (data) => requestAuthorized('PATCH', '/admin/me', data),
  changePassword:     (data) => requestAuthorized('PATCH', '/admin/me/password', data),
  uploadAvatar:       (data) => requestAuthorized('POST', '/admin/me/avatar', data),
}

export const adminAccountApi = {
  getAll:  ()         => request('GET',    '/admin/administrators'),
  create:  (data)     => request('POST',   '/admin/administrators', data),
  update:  (id, data) => request('PATCH',  `/admin/administrators/${id}`, data),
  remove:  (id)       => request('DELETE', `/admin/administrators/${id}`),
}

export const userAccountApi = {
  getAll:  ()         => request('GET',   '/admin/users'),
  update:  (id, data) => request('PATCH', `/admin/users/${id}`, data),
}

export const adminRoleApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return requestAuthorized('GET', `/admin/roles${queryString}`);
  },
  create: (data) => requestAuthorized('POST', '/admin/roles', data),
  update: (id, data) => requestAuthorized('PATCH', `/admin/roles/${id}`, data),
  remove: (id) => requestAuthorized('DELETE', `/admin/roles/${id}`),
}

export const permissionApi = {
  getMatrix: ()     => requestAuthorized('GET',  '/admin/permissions/matrix'),
  save:      (data) => requestAuthorized('POST', '/admin/permissions/matrix', data),
}

export const adminDashboardApi = {
  getDashboard: () => requestAuthorized('GET', '/home/admin/dashboard'),
}
