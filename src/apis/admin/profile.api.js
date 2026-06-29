import { API_ROOT } from "@/utils"
import authorizedAxiosAdmin from '@/utils/authorizedAxiosAdmin'

const requestAuthorized = async (method, path, data) => {
  const res = await authorizedAxiosAdmin({
    method,
    url: `${API_ROOT}${path}`,
    data,
    withCredentials: true,
  })

  return res
}

export const adminProfileApi = {
  getProfile:      ()     => requestAuthorized('GET',  '/admin/profile'),
  updateProfile:   (data) => requestAuthorized('PATCH', '/admin/profile', data),
  changePassword:  (data) => requestAuthorized('PATCH', '/admin/profile/password', data),
  uploadAvatar:    (data) => requestAuthorized('POST', '/admin/profile/avatar', data),
}