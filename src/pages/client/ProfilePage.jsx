import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserAuth } from '@/contexts/client/UserAuthContext'
import { authUserApi } from '@/apis/client/index'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export function ProfilePage() {
  const { user, refreshUser } = useUserAuth()
  const [editing, setEditing]   = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state — khởi tạo từ user context
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email:    user?.email    ?? '',
    phone:    user?.phone    ?? '',
    birthday: user?.birthday ?? '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCancel = () => {
    // Revert về giá trị từ context khi hủy
    setForm({
      fullName: user?.fullName ?? '',
      email:    user?.email    ?? '',
      phone:    user?.phone    ?? '',
      birthday: user?.birthday ?? '',
    })
    setEditing(false)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await authUserApi.updateMe({
        fullName: form.fullName,
        phone:    form.phone,
        birthday: form.birthday,
        // email thường không cho sửa trực tiếp — bỏ qua hoặc xử lý riêng
      })
      await refreshUser() // Cập nhật context với data mới nhất từ server
      toast.success('Cập nhật thông tin thành công!')
      setEditing(false)
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu thông tin!')
    } finally {
      setIsSaving(false)
    }
  }

  // Lấy chữ cái đầu để làm avatar fallback
  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : 'U'

  return (
    <div className="max-w-2xl">
      {/* Gradient Header với thông tin tóm tắt */}
      <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-8 text-white text-center mb-5">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/50 mx-auto mb-3"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-3xl font-extrabold mx-auto mb-3">
            {initials}
          </div>
        )}
        <div className="text-xl font-extrabold">{user?.fullName ?? 'Người dùng'}</div>
        <div className="text-sm opacity-80 mt-1">{user?.email ?? ''}</div>

        {/* Stats cá nhân — hardcode tạm, sẽ kết nối API sau */}
        <div className="flex justify-center gap-8 mt-5">
          {[
            { v: user?.wordsLearned ?? 0, l: 'Từ đã học' },
            { v: user?.streak       ?? 0, l: 'Ngày liên tiếp' },
            { v: user?.stars        ?? 0, l: 'Sao tích lũy' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-extrabold">{s.v}</div>
              <div className="text-xs opacity-80">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form chỉnh sửa thông tin */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-800">Thông tin cá nhân</h2>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              ✏️ Chỉnh sửa
            </Button>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Họ và tên</Label>
              <Input
                className="mt-1"
                value={editing ? form.fullName : (user?.fullName ?? '')}
                readOnly={!editing}
                onChange={e => set('fullName', e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1"
                value={user?.email ?? ''}
                readOnly // Email luôn read-only — đổi qua flow riêng
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ngày sinh</Label>
              <Input
                className="mt-1"
                type={editing ? 'date' : 'text'}
                value={editing ? form.birthday : (user?.birthday ?? '')}
                readOnly={!editing}
                onChange={e => set('birthday', e.target.value)}
              />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input
                className="mt-1"
                value={editing ? form.phone : (user?.phone ?? '')}
                readOnly={!editing}
                onChange={e => set('phone', e.target.value)}
              />
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Lưu thay đổi'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                ✕ Hủy
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}