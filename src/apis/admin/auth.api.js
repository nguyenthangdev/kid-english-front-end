import { API_ROOT } from "@/utils"
import axios from 'axios'

const request = async (method, path, data) => {
  const res = await axios({
    method,
    url: `${API_ROOT}${path}`,
    data, 
    withCredentials: true,
  });
  return res;
}

export const adminAuthApi = {
  loginAdmin:         (data) => request('POST', '/admin/auth/login', data),
  logoutAdmin:        ()     => request('POST', '/admin/auth/logout'),
  registerAdmin:      (data) => request('POST', '/admin/auth/register', data),
  refreshTokenAdmin:  ()     => request('POST', '/admin/auth/refresh-token')
}