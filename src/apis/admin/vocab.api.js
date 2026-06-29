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

export const adminVocabApi = {
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return requestAuthorized('GET', `/admin/vocabularies${queryString}`);
  },
  getOne:  (id)       => requestAuthorized('GET',    `/admin/vocabularies/${id}`),
  create:  (data)     => requestAuthorized('POST',   '/admin/vocabularies', data),
  update:  (id, data) => requestAuthorized('PATCH',  `/admin/vocabularies/${id}`, data),
  remove:  (id)       => requestAuthorized('DELETE', `/admin/vocabularies/${id}`),
  uploadImage: (formData) => requestAuthorized('POST', '/admin/vocabularies/upload-image', formData, {}),
}


