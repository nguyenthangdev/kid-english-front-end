import { useState } from 'react'
import { useQuote } from '@/contexts/QuoteContext'
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

function QuoteModal({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(item ?? { text: '', trans: '', author: '', tag: 'study', isToday: false })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{item?.id ? 'Chỉnh sửa câu nói' : 'Thêm câu nói mới'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label>Câu nói (tiếng Anh)</Label><textarea className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 resize-none" rows={3} value={form.text} onChange={e => set('text', e.target.value)} /></div>
          <div><Label>Dịch nghĩa</Label><textarea className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 resize-none" rows={2} value={form.trans} onChange={e => set('trans', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tác giả</Label><Input className="mt-1" value={form.author} onChange={e => set('author', e.target.value)} placeholder="Unknown" /></div>
            <div>
              <Label>Thẻ chủ đề</Label>
              <Select value={form.tag} onValueChange={v => set('tag', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">study</SelectItem>
                  <SelectItem value="motivation">motivation</SelectItem>
                  <SelectItem value="friendship">friendship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Câu nói hôm nay</Label>
            <input type="checkbox" checked={form.isToday} onChange={e => set('isToday', e.target.checked)} className="w-4 h-4 accent-emerald-500" />
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

export function QuoteManagePage() {
  const { quotes, addQuote, updateQuote, deleteQuote } = useQuote()
  const { query, setQuery, filtered } = useSearch(quotes, ['text', 'author'])
  const { page, setPage, totalPages, paged } = usePagination(filtered)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    // TODO: gọi quoteApi.create(form) hoặc quoteApi.update(modal.id, form)
    if (modal?.id) updateQuote(modal.id, form)
    else addQuote(form)
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Câu nói mỗi ngày" action="Thêm câu nói" onAction={() => setModal({})} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar placeholder="Tìm câu nói..." value={query} onChange={v => { setQuery(v); setPage(1) }} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>{['#', 'Câu nói', 'Tác giả', 'Thẻ', 'Hôm nay', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((q, i) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-400">{(page - 1) * 8 + i + 1}</td>
                  <td className="px-5 py-4 max-w-xs">
                    <div className="text-sm font-bold text-gray-700 italic truncate">"{q.text}"</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">{q.trans}</div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-700">{q.author}</td>
                  <td className="px-5 py-4"><CategoryBadge value={q.tag} type="tag" /></td>
                  <td className="px-5 py-4">{q.isToday ? <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Hôm nay</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(q)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">✏️</button>
                      <button onClick={() => setDeleteId(q.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-3"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </div>
      <QuoteModal open={!!modal} item={modal} onClose={() => setModal(null)} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteQuote(deleteId); setDeleteId(null) }} />
    </div>
  )
}