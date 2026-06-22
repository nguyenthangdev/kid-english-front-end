import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RegisterPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌟</div>
          <div className="text-2xl font-extrabold text-emerald-600">Tạo tài khoản</div>
          <p className="text-sm text-gray-500 mt-1">Bắt đầu hành trình học tiếng Anh!</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Họ</Label><Input className="mt-1" placeholder="Nguyễn" /></div>
            <div><Label>Tên</Label><Input className="mt-1" placeholder="An" /></div>
          </div>
          <div><Label>Email</Label><Input className="mt-1" type="email" placeholder="your@email.com" /></div>
          <div><Label>Mật khẩu</Label><Input className="mt-1" type="password" placeholder="Ít nhất 8 ký tự" /></div>
          <div><Label>Xác nhận mật khẩu</Label><Input className="mt-1" type="password" placeholder="••••••••" /></div>
          <Button className="w-full" onClick={() => navigate('/home')}>🎉 Tạo tài khoản</Button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Đã có tài khoản?{' '}
          <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => navigate('/login')}>Đăng nhập</span>
        </p>
      </div>
    </div>
  )
}