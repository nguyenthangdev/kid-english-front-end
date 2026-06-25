import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '@/utils'

const authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

let refreshTokenPromise = null

const fetchLogoutUserAPI = () => axios({
  method: 'POST',
  url: `${API_ROOT}/user/auth/logout`,
  withCredentials: true,
})

const refreshTokenUserAPI = () => axios({
  method: 'POST',
  url: `${API_ROOT}/user/auth/refresh-token`,
  withCredentials: true,
})

authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config

  if ((error.response?.status === 401 || error.response?.status === 410) && originalRequest) {

    if (originalRequest._retry) {
      await fetchLogoutUserAPI().catch(() => { })
      window.dispatchEvent(new CustomEvent('force-logout-user'))
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // Single Promise Lock: chỉ gửi DUY NHẤT 1 request refresh token
    // dù có bao nhiêu request đồng thời bị lỗi
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenUserAPI()
        .then((res) => res)
        .catch(async (_error) => {
          // Refresh cũng thất bại → session hết hiệu lực hoàn toàn
          await fetchLogoutUserAPI().catch(() => { })
          window.dispatchEvent(new CustomEvent('force-logout-user'))
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null // Mở khóa sau khi hoàn thành
        })
    }

    // Tất cả request đang chờ sẽ retry sau khi token mới được cấp
    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest)
    })
  }

  // Các lỗi khác: hiển thị toast
  toast.error(error.response?.data?.message || error?.message)
  return Promise.reject(error)
})

export default authorizedAxiosInstance