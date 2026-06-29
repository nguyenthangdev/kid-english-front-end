import { API_ROOT } from "@/utils"
import authorizedAxiosAdmin from '@/utils/authorizedAxiosAdmin'

const requestAuthorized = async (method, path, data, params = {}) => {
  const res = await authorizedAxiosAdmin({
    method,
    url: `${API_ROOT}${path}`,
    data,
    params,
    withCredentials: true,
  })

  return res.data
}

export const adminAccountApi = {
  getAll:  (params)   => requestAuthorized('GET',    '/admin/administrators', null, params),
  create:  (data)     => requestAuthorized('POST',   '/admin/administrators', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/administrators/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/administrators/${id}`),
}

export const userAccountApi = {
  getAll:  (params)   => requestAuthorized('GET',   '/admin/users', null, params),
  update:  (id, data) => requestAuthorized('PATCH', `/admin/users/${id}`, data),
}
