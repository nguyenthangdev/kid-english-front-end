import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserAuth } from '@/contexts/client/UserAuthContext'
import { authUserApi } from '@/apis/client/index'
import { userLoginSchema } from '@/validations/client/auth.validation'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useUserAuth()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authUserApi.login(data)
      // Backend trả về { user: {...} } hoặc { data: { user: {...} } }
      const userData = response?.user ?? response?.data?.user
      if (response.code === 200) {
        login(userData)
        toast.success(response?.message || 'Đăng nhập thành công! 🎉')
        navigate('/', { replace: true })
      } else {
        toast.error(response?.message || 'Đăng nhập thất bại! ❌')
      }
    } catch (error) {
      console.log('error', error.response)

      // Lỗi đã được toast bởi Axios interceptor
      // if (error.response?.status === 409) {
      //   toast.error(error.response.message)
      // }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <div className="text-2xl font-extrabold text-emerald-600">KidEnglish</div>
          <p className="text-sm text-gray-500 mt-1">Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              className="mt-1"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              className="mt-1"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-sm text-emerald-600 font-bold cursor-pointer hover:underline">
              Quên mật khẩu?
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Đang đăng nhập...
              </span>
            ) : '🚀 Đăng nhập'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{' '}
          <span
            className="text-emerald-600 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  )
}
