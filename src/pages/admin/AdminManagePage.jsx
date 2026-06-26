import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { adminAccountApi } from '@/apis/admin'
import { useRoles } from '@/contexts/admin/RoleContext'
import { toast } from 'react-toastify'
import { Loader2, SquarePen, Trash2 } from 'lucide-react'

// -- MOCK DATA CŨ (giữ lại để rollback nhanh nếu cần) --
// import { MOCK_ADMINS, MOCK_ROLES } from '@/utils/mockData'

// --- Sub-component Modal (giữ nguyên UI, chỉ thay data source) ---
function AdminModal({ open, item, roles, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(item ?? { fullName: '', email: '', password: '', roleId: '', status: 'active' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Sync form khi item thay đổi (mở modal sửa)
  useEffect(() => {
    if (item) {
      setForm({
        fullName: item.fullName ?? item.name ?? '',
        email:    item.email ?? '',
        password: '',
        roleId:   item.role?.id ?? item.roleId ?? '',
        status:   item.status ?? 'active',
      })
    } else {
      setForm({ fullName: '', email: '', password: '', roleId: '', status: 'active' })
    }
  }, [item])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{item?.id ? 'Chỉnh sửa Admin' : 'Thêm tài khoản Admin'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Họ và tên</Label><Input className="mt-1" value={form.fullName} onChange={e => set('fullName', e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          </div>
          <div>
            <Label>Nhóm quyền</Label>
            <Select value={form.roleId} onValueChange={v => set('roleId', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn nhóm quyền" /></SelectTrigger>
              <SelectContent>
                {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {!item?.id && (
            <>
              <div><Label>Mật khẩu</Label><Input className="mt-1" type="password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
            </>
          )}
          <div className="flex items-center justify-between">
            <Label>Kích hoạt tài khoản</Label>
            <input type="checkbox" checked={form.status === 'active'} onChange={e => set('status', e.target.checked ? 'active' : 'inactive')} className="w-4 h-4 accent-emerald-500" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Hủy</Button>
          <Button onClick={() => onSave(form)} disabled={isSaving} className="min-w-[90px]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Lưu lại'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Page ---
export function AdminManagePage() {
  const { state: { roles }, fetchRoles } = useRoles()

  const [admins,     setAdmins]     = useState([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [isSaving,   setIsSaving]   = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [modal,      setModal]      = useState(null)   // null = đóng, {} = thêm mới, {...admin} = sửa
  const [deleteId,   setDeleteId]   = useState(null)

  // Fetch danh sách admin từ API
  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await adminAccountApi.getAll()
      setAdmins(response?.data ?? response ?? [])
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải danh sách admin!')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
    fetchRoles()
  }, [fetchAdmins, fetchRoles])

  // Thêm mới hoặc cập nhật admin
  const handleSave = async (form) => {
    try {
      setIsSaving(true)
      if (modal?.id) {
        await adminAccountApi.update(modal.id, form)
        toast.success('Cập nhật tài khoản admin thành công!')
      } else {
        await adminAccountApi.create(form)
        toast.success('Thêm tài khoản admin mới thành công!')
      }
      setModal(null)
      fetchAdmins()
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu tài khoản admin!')
    } finally {
      setIsSaving(false)
    }
  }

  // Xóa admin
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await adminAccountApi.remove(deleteId)
      toast.success('Đã xóa tài khoản admin!')
      setDeleteId(null)
      fetchAdmins()
    } catch (error) {
      toast.error(error.message || 'Lỗi khi xóa tài khoản admin!')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Tài khoản Admin" action="Thêm Admin" onAction={() => setModal({})} />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[200px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>{['#', 'Tên', 'Email', 'Nhóm quyền', 'Trạng thái', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.length === 0 && !isLoading && (
              <tr><td colSpan="6" className="px-5 py-8 text-center text-gray-400">Chưa có tài khoản admin nào.</td></tr>
            )}
            {admins.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                      {(a.fullName ?? a.name ?? '?')[0]}
                    </div>
                    <span className="font-bold text-sm text-gray-800">{a.fullName ?? a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{a.email}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">
                    {a.role?.name ?? a.role ?? '—'}
                  </span>
                </td>
                <td className="px-5 py-4"><StatusBadge active={a.status === 'active'} /></td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(a)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                    <button onClick={() => setDeleteId(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={!!modal}
        item={modal}
        roles={roles}
        onClose={() => !isSaving && setModal(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa tài khoản Admin"
        description="Bạn có chắc chắn muốn xóa tài khoản admin này không?"
        isLoading={isDeleting}
      />
    </div>
  )
}