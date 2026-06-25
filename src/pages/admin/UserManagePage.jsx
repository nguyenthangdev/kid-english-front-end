import { useState } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { StatusBadge } from '@/components/StatusBadge'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MOCK_USERS } from '@/utils/mockData'
import { SquarePen, Trash2 } from 'lucide-react'

export function UserManagePage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const { query, setQuery, filtered } = useSearch(users, ['name', 'email'])
  const { page, setPage, totalPages, paged } = usePagination(filtered)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = () => {
    // TODO: gọi userApi.update(modal.id, form)
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Người dùng" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar placeholder="Tìm người dùng..." value={query} onChange={v => { setQuery(v); setPage(1) }} />
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{filtered.length} người dùng</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>{['#', 'Người dùng', 'Ngày tham gia', 'Từ đã học', 'Streak', 'Trạng thái', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-400">{(page - 1) * 8 + i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{u.name[0]}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-800">{u.words}</td>
                  <td className="px-5 py-4"><span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🔥 {u.streak}</span></td>
                  <td className="px-5 py-4"><StatusBadge active={u.status === 'active'} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(u)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteId(u.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-3"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </div>

      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Chỉnh sửa người dùng</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Họ và tên</Label><Input className="mt-1" defaultValue={modal?.name} /></div>
            <div><Label>Email</Label><Input className="mt-1" defaultValue={modal?.email} /></div>
            <div className="flex items-center justify-between">
              <Label>Kích hoạt tài khoản</Label>
              <input type="checkbox" defaultChecked={modal?.status === 'active'} className="w-4 h-4 accent-emerald-500" />
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">⚠️ Không thể thay đổi mật khẩu trực tiếp.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>Hủy</Button>
            <Button onClick={handleSave}>💾 Lưu lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}