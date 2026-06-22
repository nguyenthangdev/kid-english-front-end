import { useState } from 'react'
import { useVocab } from '@/contexts/VocabContext'
import { useCategory } from '@/contexts/CategoryContext'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { Pagination } from '@/components/Pagination'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function VocabModal({ open, item, categories, onClose, onSave }) {
  const [form, setForm] = useState(item ?? { word: '', phonetic: '', meaning: '', category: '', example: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{item?.id ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Từ (tiếng Anh)</Label><Input className="mt-1" value={form.word} onChange={e => set('word', e.target.value)} placeholder="love" /></div>
            <div><Label>Phiên âm</Label><Input className="mt-1" value={form.phonetic} onChange={e => set('phonetic', e.target.value)} placeholder="/lʌv/" /></div>
          </div>
          <div><Label>Nghĩa (tiếng Việt)</Label><Input className="mt-1" value={form.meaning} onChange={e => set('meaning', e.target.value)} placeholder="yêu thương" /></div>
          <div>
            <Label>Danh mục</Label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.name} value={c.name}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Ví dụ câu</Label><Input className="mt-1" value={form.example} onChange={e => set('example', e.target.value)} placeholder="I love you." /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={() => onSave(form)}>💾 Lưu lại</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function VocabManagePage() {
  const { vocabs, addVocab, updateVocab, deleteVocab } = useVocab()
  const { categories } = useCategory()
  const { query, setQuery, filtered } = useSearch(vocabs, ['word', 'meaning'])
  const { page, setPage, totalPages, paged } = usePagination(filtered)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    // TODO: gọi vocabApi.create(form) hoặc vocabApi.update(modal.id, form)
    if (modal?.id) updateVocab(modal.id, form)
    else addVocab(form)
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Từ vựng của bé" action="Thêm từ vựng" onAction={() => setModal({})} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar placeholder="Tìm từ vựng..." value={query} onChange={v => { setQuery(v); setPage(1) }} />
          <span className="text-sm text-gray-500">{filtered.length} từ vựng</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>{['#', 'Từ vựng', 'Phiên âm', 'Nghĩa', 'Danh mục', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((v, i) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400">{(page - 1) * 8 + i + 1}</td>
                  <td className="px-5 py-4 text-lg font-extrabold text-gray-800">{v.word}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 font-mono">{v.phonetic}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{v.meaning}</td>
                  <td className="px-5 py-4"><CategoryBadge value={v.category} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(v)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">✏️</button>
                      <button onClick={() => setDeleteId(v.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-3"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </div>

      <VocabModal open={!!modal} item={modal} categories={categories} onClose={() => setModal(null)} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteVocab(deleteId); setDeleteId(null) }} />
    </div>
  )
}