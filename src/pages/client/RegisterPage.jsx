import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authUserApi } from '@/apis/client/index'
import { userRegisterSchema } from '@/validations/client/auth.validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  // eslint-disable-next-line no-unused-vars
  const onSubmit = async ({ confirmPassword, ...rest }) => {
    setIsLoading(true)
    try {
      const response = await authUserApi.register(rest)
      console.log('response register: ', response)
      if (response.code === 201) {
        toast.success(response?.message || 'Tạo tài khoản thành công! 🎉')
        navigate('/login')
      } else {
        toast.error(response?.message || 'Tạo tài khoản thành công! 🎉')
      }
    } catch(error) {
      // Lỗi đã được toast bởi Axios interceptor
      console.log('error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌟</div>
          <div className="text-2xl font-extrabold text-emerald-600">Tạo tài khoản</div>
          <p className="text-sm text-gray-500 mt-1">Bắt đầu hành trình học tiếng Anh!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Họ và Tên</Label>
            <Input id="fullName" className="mt-1" placeholder="Nguyễn Văn An" {...register('fullName')} />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" className="mt-1" type="email" placeholder="your@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="reg-password">Mật khẩu</Label>
            <Input id="reg-password" className="mt-1" type="password" placeholder="Ít nhất 6 ký tự" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input id="confirmPassword" className="mt-1" type="password" placeholder="••••••••" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tạo tài khoản...
              </span>
            ) : '🎉 Tạo tài khoản'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Đã có tài khoản?{' '}
          <span
            className="text-emerald-600 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  )
}
