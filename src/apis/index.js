import { API_ROOT } from "@/utils"
import axios from 'axios'

const request = async (method, path, data) => {
  try {
    const res = await axios({
      method,
      url: `${API_ROOT}${path}`,
      data, 
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message;
      
    throw new Error(errorMessage, { cause: error });
  }
}

export const vocabApi = {
  getAll:  ()         => request('GET',    '/vocabs'),
  getOne:  (id)       => request('GET',    `/vocabs/${id}`),
  create:  (data)     => request('POST',   '/vocabs', data),
  update:  (id, data) => request('PATCH',  `/vocabs/${id}`, data),
  remove:  (id)       => request('DELETE', `/vocabs/${id}`),
}

export const quoteApi = {
  getAll:  ()         => request('GET',    '/quotes'),
  getOne:  (id)       => request('GET',    `/quotes/${id}`),
  create:  (data)     => request('POST',   '/quotes', data),
  update:  (id, data) => request('PATCH',  `/quotes/${id}`, data),
  remove:  (id)       => request('DELETE', `/quotes/${id}`),
}

export const vocabCategoryApi = {
  getAll:  ()         => request('GET',    '/vocab-category'),
  create:  (data)     => request('POST',   '/vocab-category', data),
  update:  (id, data) => request('PATCH',  `/vocab-category/${id}`, data),
  remove:  (id)       => request('DELETE', `/vocab-category/${id}`),
}

export const quoteCategoryApi = {
  getAll:  ()         => request('GET',    '/quote-category'),
  create:  (data)     => request('POST',   '/quote-category', data),
  update:  (id, data) => request('PATCH',  `/quote-category/${id}`, data),
  remove:  (id)       => request('DELETE', `/quote-category/${id}`),
}

export const authAdminApi = {
  loginAdmin:    (data) => request('POST', '/auth/login', data),
  registerAdmin: (data) => request('POST', '/auth/register', data),
  logoutAdmin: (data) => request('POST', '/auth/register', data),
  refreshTokenAdmin: (data) => request('POST', '/auth/register', data),
}

export const adminApi = {
  getAll:  ()         => request('GET',    '/admins'),
  create:  (data)     => request('POST',   '/admins', data),
  update:  (id, data) => request('PATCH',  `/admins/${id}`, data),
  remove:  (id)       => request('DELETE', `/admins/${id}`),
}

export const userApi = {
  getAll:  ()         => request('GET',   '/users'),
  update:  (id, data) => request('PATCH', `/users/${id}`, data),
}

export const roleApi = {
  getAll:  ()         => request('GET',    '/roles'),
  create:  (data)     => request('POST',   '/roles', data),
  update:  (id, data) => request('PATCH',  `/roles/${id}`, data),
  remove:  (id)       => request('DELETE', `/roles/${id}`),
}

export const permissionApi = {
  getMatrix: ()     => request('GET',  '/permissions/matrix'),
  save:      (data) => request('POST', '/permissions/matrix', data),
}