import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'
import { adminAuthApi } from '@/apis/admin'
import { Loader2 } from 'lucide-react'
import { loginSchema } from '@/validations/admin/auth.validation'
import { toast } from 'react-toastify'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [isLoading, setIsLoading] = useState(false)

  // 2. Khởi tạo react-hook-form với zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const response = await adminAuthApi.loginAdmin({ 
        email: data.email, 
        password: data.password 
      })
      const responseData = response.data
      login(responseData.accountAdmin, responseData.role)
      toast.success(responseData.message)
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <div className="text-2xl font-extrabold text-violet-600">Trang Quản Trị</div>
          <p className="text-sm text-gray-500 mt-1">Đăng nhập quản trị</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Box Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              className={`mt-1 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
              type="email" 
              placeholder="admin@kidenglish.com" 
              disabled={isLoading}
              {...register('email')} 
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
            )}
          </div>
          
          {/* Box Password */}
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input 
              id="password"
              className={`mt-1 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
              type="password" 
              placeholder="••••••••" 
              disabled={isLoading}
              {...register('password')} 
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
            )}
          </div>
       
          <Button 
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 mt-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              '🚀 Đăng nhập'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
