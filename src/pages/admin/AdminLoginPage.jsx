import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/contexts/AuthContext'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: gọi authApi.login({ email, password }) ở đây
    login({ name: 'Super Admin', email }, 'mock-admin-token')
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-100 p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <div className="text-2xl font-extrabold text-violet-600">Admin Panel</div>
          <p className="text-sm text-gray-500 mt-1">Đăng nhập quản trị</p>
        </div>
        <div className="space-y-4">
          <div><Label>Email</Label><Input className="mt-1" type="email" placeholder="admin@kidenglish.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Mật khẩu</Label><Input className="mt-1" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={handleLogin}>🚀 Đăng nhập</Button>
        </div>
      </div>
    </div>
  )
}