import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  return (
    <div className="max-w-2xl">
      <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-8 text-white text-center mb-5">
        <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-3xl font-extrabold mx-auto mb-3">
          {user?.name?.[0] ?? 'A'}
        </div>
        <div className="text-xl font-extrabold">{user?.name ?? 'Nguyễn Văn An'}</div>
        <div className="text-sm opacity-80 mt-1">{user?.email ?? 'user@kidenglish.com'}</div>
        <div className="flex justify-center gap-8 mt-5">
          {[{ v: 45, l: 'Từ đã học' }, { v: 7, l: 'Ngày liên tiếp' }, { v: 3, l: 'Sao tích lũy' }].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-extrabold">{s.v}</div>
              <div className="text-xs opacity-80">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-800">Thông tin cá nhân</h2>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? '✕ Hủy' : '✏️ Chỉnh sửa'}
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Họ và tên</Label><Input className="mt-1" defaultValue="Nguyễn Văn An" readOnly={!editing} /></div>
            <div><Label>Email</Label><Input className="mt-1" defaultValue="user@kidenglish.com" readOnly={!editing} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Ngày sinh</Label><Input className="mt-1" defaultValue="15/01/2000" readOnly={!editing} /></div>
            <div><Label>Số điện thoại</Label><Input className="mt-1" defaultValue="0912345678" readOnly={!editing} /></div>
          </div>
          {editing && (
            <Button onClick={() => {
              // TODO: gọi API update profile
              setEditing(false)
            }}>💾 Lưu thay đổi</Button>
          )}
        </div>
      </div>
    </div>
  )
}