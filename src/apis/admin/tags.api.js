
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

export const adminVocabTagsApi = {
  getAll: (params) => {
    const finalParams = { type: 'VOCAB', ...params };
    const queryString = new URLSearchParams(finalParams).toString();
    return requestAuthorized('GET', `/admin/tags?${queryString}`);
  },
  create:  (data)     => requestAuthorized('POST',   '/admin/tags', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/tags/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/tags/${id}`),
}

export const adminQuoteTagsApi = {
  getAll: (params) => {
    const finalParams = { type: 'QUOTE', ...params }
    const queryString = new URLSearchParams(finalParams).toString()
    return requestAuthorized('GET', `/admin/tags?${queryString}`) 
  },
  create:  (data)     => requestAuthorized('POST',   '/admin/tags', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/tags/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/tags/${id}`),
}