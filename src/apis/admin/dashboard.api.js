
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

export const adminDashboardApi = {
  getDashboard: () => requestAuthorized('GET', '/home/admin/dashboard'),
}
