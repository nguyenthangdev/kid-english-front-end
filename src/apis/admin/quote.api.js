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

export const adminQuoteApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return requestAuthorized('GET', `/admin/quotes${queryString}`);
  },
  getOne:  (id)       => requestAuthorized('GET',    `/admin/quotes/${id}`),
  create:  (data)     => requestAuthorized('POST',   '/admin/quotes', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/quotes/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/quotes/${id}`),
}