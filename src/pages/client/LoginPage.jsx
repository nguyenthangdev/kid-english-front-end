import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: gọi authApi.login({ email, password }) ở đây
    login({ name: 'Nguyễn Văn An', email }, 'mock-token')
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <div className="text-2xl font-extrabold text-emerald-600">KidEnglish</div>
          <p className="text-sm text-gray-500 mt-1">Chào mừng bạn trở lại!</p>
        </div>
        <div className="space-y-4">
          <div><Label>Email</Label><Input className="mt-1" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Mật khẩu</Label><Input className="mt-1" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="text-right"><span className="text-sm text-emerald-600 font-bold cursor-pointer">Quên mật khẩu?</span></div>
          <Button className="w-full" onClick={handleLogin}>🚀 Đăng nhập</Button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{' '}
          <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => navigate('/register')}>Đăng ký ngay</span>
        </p>
      </div>
    </div>
  )
}