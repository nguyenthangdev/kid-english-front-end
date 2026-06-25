import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MOCK_ROLES } from '@/utils/mockData'
import { SquarePen, Trash2 } from 'lucide-react'

export function RoleManagePage() {
  const [roles, setRoles] = useState(MOCK_ROLES)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', desc: '' })
  const [deleteId, setDeleteId] = useState(null)

  const openModal = (item) => { setForm(item ?? { name: '', desc: '' }); setModal(item ?? {}) }

  const handleSave = () => {
    // TODO: gọi roleApi.create(form) hoặc roleApi.update(modal.id, form)
    if (modal?.id) setRoles(r => r.map(x => x.id === modal.id ? { ...x, ...form } : x))
    else setRoles(r => [...r, { ...form, id: Date.now().toString(), users: 0 }])
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Nhóm quyền" action="Tạo nhóm quyền" onAction={() => openModal(null)} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>{['#', 'Tên nhóm', 'Mô tả', 'Số thành viên', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-4"><span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">{r.name}</span></td>
                <td className="px-5 py-4 text-sm text-gray-500">{r.desc}</td>
                <td className="px-5 py-4 text-sm font-bold text-gray-800">{r.users} người</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                      <button onClick={() => setModal(r)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteId(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{modal?.id ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Tên nhóm quyền</Label><Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Content Manager" /></div>
            <div><Label>Mô tả</Label><textarea className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 resize-none" rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>Hủy</Button>
            <Button onClick={handleSave}>💾 Lưu lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setRoles(r => r.filter(x => x.id !== deleteId)); setDeleteId(null) }} />
    </div>
  )
}