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

export const adminAccountApi = {
  getAll:  ()         => requestAuthorized('GET',    '/admin/administrators'),
  create:  (data)     => requestAuthorized('POST',   '/admin/administrators', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/administrators/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/administrators/${id}`),
}

export const userAccountApi = {
  getAll:  ()         => requestAuthorized('GET',   '/admin/users'),
  update:  (id, data) => requestAuthorized('PATCH', `/admin/users/${id}`, data),
}
