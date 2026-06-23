import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'

export function AdminProfilePage() {
  const { admin } = useAdminAuth()
  const [editing, setEditing] = useState(false)

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl p-8 text-white text-center">
        <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-3xl font-extrabold mx-auto mb-3">A</div>
        <div className="text-xl font-extrabold">{admin?.name ?? 'Super Admin'}</div>
        <div className="text-sm opacity-80 mt-1">{admin?.email ?? 'admin@kidenglish.com'}</div>
        <div className="mt-3"><span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">🛡️ Super Admin</span></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-800">Thông tin cá nhân</h2>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>{editing ? '✕ Hủy' : '✏️ Chỉnh sửa'}</Button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Họ và tên</Label><Input className="mt-1" defaultValue="Nguyễn Admin" readOnly={!editing} /></div>
            <div><Label>Email</Label><Input className="mt-1" defaultValue="admin@kidenglish.com" readOnly={!editing} /></div>
          </div>
          {editing && <Button onClick={() => { /* TODO: gọi API */ setEditing(false) }}>💾 Lưu thay đổi</Button>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-extrabold text-gray-800">🔐 Đổi mật khẩu</div>
        <div className="p-6 space-y-4">
          <div><Label>Mật khẩu hiện tại</Label><Input className="mt-1" type="password" placeholder="••••••••" /></div>
          <div><Label>Mật khẩu mới</Label><Input className="mt-1" type="password" placeholder="Ít nhất 8 ký tự" /></div>
          <div><Label>Xác nhận mật khẩu mới</Label><Input className="mt-1" type="password" placeholder="••••••••" /></div>
          <Button onClick={() => { /* TODO: gọi API */ }}>🔒 Cập nhật mật khẩu</Button>
        </div>
      </div>
    </div>
  )
}