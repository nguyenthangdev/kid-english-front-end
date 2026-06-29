import { API_ROOT } from "@/utils"
import authorizedAxiosAdmin from '@/utils/authorizedAxiosAdmin'

const requestAuthorized = async (method, path, data) => {
  const res = await authorizedAxiosAdmin({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })

  return res.data
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

export const adminPermissionApi = {
  getAll:     ()     => requestAuthorized('GET',  '/admin/permissions'),
  saveMatrix: (data) => requestAuthorized('POST', '/admin/permissions/matrix', data),
}