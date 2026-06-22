import { useState } from 'react'
import { useCategory } from '@/contexts/CategoryContext'
import { PageHeader } from '@/components/PageHeader'
import { CategoryBadge } from '@/components/CategoryBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const COLORS = ['green', 'blue', 'pink', 'yellow', 'purple', 'orange']

function CatModal({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(item ?? { name: '', label: '', color: 'green' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{item?.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label>Tên danh mục (slug)</Label><Input className="mt-1" value={form.name} onChange={e => set('name', e.target.value)} placeholder="animals" /></div>
          <div><Label>Tên hiển thị</Label><Input className="mt-1" value={form.label} onChange={e => set('label', e.target.value)} placeholder="Động vật" /></div>
          <div>
            <Label>Màu sắc</Label>
            <Select value={form.color} onValueChange={v => set('color', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
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

export function CategoryManagePage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategory()
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    // TODO: gọi categoryApi.create(form) hoặc categoryApi.update(modal.id, form)
    if (modal?.id) updateCategory(modal.id, form)
    else addCategory(form)
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Danh mục từ vựng" action="Thêm danh mục" onAction={() => setModal({})} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>{['#', 'Slug', 'Tên hiển thị', 'Màu', 'Số từ', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-4 font-mono text-sm text-gray-700">{c.name}</td>
                <td className="px-5 py-4 font-bold text-gray-800">{c.label}</td>
                <td className="px-5 py-4"><CategoryBadge value={c.name} /></td>
                <td className="px-5 py-4 text-sm font-bold text-gray-700">{c.count} từ</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(c)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">✏️</button>
                    <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-sm">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CatModal open={!!modal} item={modal} onClose={() => setModal(null)} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteCategory(deleteId); setDeleteId(null) }} />
    </div>
  )
}