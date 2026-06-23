import axios from 'axios'
import { authAdminApi } from '@/apis/index'
import { toast } from 'react-toastify'

const authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes
authorizedAxiosInstance.defaults.withCredentials = true
// Ép axios không cache auth API
// authorizedAxiosInstance.defaults.headers.common['Cache-Control'] = 'no-cache'

authorizedAxiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  if (error.response?.status === 401) {
    await authAdminApi.logoutAdmin().catch(() => {}) // Logout phía server

    // Thay vì location.href, hãy bắn ra một sự kiện
    const event = new CustomEvent('force-logout')
    window.dispatchEvent(event)

    return Promise.reject(error)
  }
  const originalRequest = error.config

  if (error.response?.status === 410 && originalRequest) {

    if (originalRequest._retry) {
      await authAdminApi.logoutAdmin().catch(() => {}) // Logout phía server

      // Thay vì location.href, hãy bắn ra một sự kiện
      const event = new CustomEvent('force-logout')
      window.dispatchEvent(event)

      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = authAdminApi.refreshTokenAdmin()
        .then((res) => {
          return res
        })
        .catch(async (_error) => {
          await authAdminApi.refreshTokenAdmin()
            .catch(() => {})

          const event = new CustomEvent('force-logout')
          window.dispatchEvent(event)
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest)
    })
  }

  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance