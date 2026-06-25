import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MOCK_ADMINS, MOCK_ROLES } from '@/utils/mockData'
import { SquarePen, Trash2 } from 'lucide-react'

function AdminModal({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(item ?? { name: '', email: '', role: 'Moderator', status: 'active' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{item?.id ? 'Chỉnh sửa Admin' : 'Thêm tài khoản Admin'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Họ và tên</Label><Input className="mt-1" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          </div>
          <div>
            <Label>Nhóm quyền</Label>
            <Select value={form.role} onValueChange={v => set('role', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{MOCK_ROLES.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {!item?.id && (
            <>
              <div><Label>Mật khẩu</Label><Input className="mt-1" type="password" /></div>
              <div><Label>Xác nhận mật khẩu</Label><Input className="mt-1" type="password" /></div>
            </>
          )}
          <div className="flex items-center justify-between">
            <Label>Kích hoạt tài khoản</Label>
            <input type="checkbox" checked={form.status === 'active'} onChange={e => set('status', e.target.checked ? 'active' : 'inactive')} className="w-4 h-4 accent-emerald-500" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={() => onSave(form)}>💾 Lưu lại</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AdminManagePage() {
  const [admins, setAdmins] = useState(MOCK_ADMINS)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    // TODO: gọi adminApi.create(form) hoặc adminApi.update(modal.id, form)
    if (modal?.id) setAdmins(a => a.map(x => x.id === modal.id ? { ...x, ...form } : x))
    else setAdmins(a => [...a, { ...form, id: Date.now().toString() }])
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Tài khoản Admin" action="Thêm Admin" onAction={() => setModal({})} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>{['#', 'Tên', 'Email', 'Nhóm quyền', 'Trạng thái', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">{a.name[0]}</div>
                    <span className="font-bold text-sm text-gray-800">{a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{a.email}</td>
                <td className="px-5 py-4"><span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">{a.role}</span></td>
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
      <AdminModal open={!!modal} item={modal} onClose={() => setModal(null)} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setAdmins(a => a.filter(x => x.id !== deleteId)); setDeleteId(null) }} />
    </div>
  )
}