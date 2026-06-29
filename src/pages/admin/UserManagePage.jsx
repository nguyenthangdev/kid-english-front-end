import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { StatusBadge } from '@/components/StatusBadge'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { userAccountApi } from '@/apis/admin'
import { toast } from 'react-toastify'
import { Loader2, SquarePen, Trash2 } from 'lucide-react'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'

// -- MOCK DATA CŨ (giữ lại để rollback nhanh nếu cần) --
// import { MOCK_USERS } from '@/utils/mockData'

export function UserManagePage() {
  const { hasPermission } = useAdminAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const urlKeyword = searchParams.get('keyword') || ''
  const [inputValue, setInputValue] = useState(urlKeyword)
  const debouncedKeyword = useDebounce(inputValue, 500)

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Form state cho modal sửa
  const [form, setForm] = useState({ fullName: '', email: '', isActive: true })
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Fetch danh sách user
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = { page, limit: 10 }
      if (debouncedKeyword) params.search = debouncedKeyword
      const response = await userAccountApi.getAll(params)
      setUsers(response?.data ?? response ?? [])
      setTotalPages(response?.totalPages ?? 1)
      setTotalCount(response?.total ?? 0)
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải danh sách người dùng!')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedKeyword])

  useEffect(() => {
    const currentUrlKeyword = searchParams.get('keyword') || ''
    const currentUrlPage = searchParams.get('page') || '1'
    let urlChanged = false

    if (debouncedKeyword !== currentUrlKeyword) {
      debouncedKeyword ? searchParams.set('keyword', debouncedKeyword) : searchParams.delete('keyword')
      urlChanged = true
    }
    if (page.toString() !== currentUrlPage) {
      page > 1 ? searchParams.set('page', page.toString()) : searchParams.delete('page')
      urlChanged = true
    }
    if (urlChanged) setSearchParams(searchParams)

    fetchUsers()
  }, [debouncedKeyword, page, fetchUsers, searchParams, setSearchParams])

  // Mở modal sửa — sync form với data user
  const openEditModal = (user) => {
    setModal(user)
    setForm({
      fullName: user.fullName ?? user.name ?? '',
      email: user.email ?? '',
      isActive: user.isActive ?? true,
    })
  }

  // Lưu chỉnh sửa user
  const handleSave = async () => {
    if (!modal?.id) return
    try {
      setIsSaving(true)
      await userAccountApi.update(modal.id, form)
      toast.success('Cập nhật người dùng thành công!')
      setModal(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.message || 'Lỗi khi cập nhật người dùng!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Người dùng" />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[200px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar placeholder="Tìm người dùng..." value={inputValue} onChange={v => { setInputValue(v); setPage(1) }} />
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {totalCount} người dùng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>{['#', 'Người dùng', 'Ngày tham gia', 'Từ đã học', 'Streak', 'Trạng thái', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 && !isLoading && (
                <tr><td colSpan="7" className="px-5 py-8 text-center text-gray-400">Chưa có người dùng nào.</td></tr>
              )}
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-400">{(page - 1) * 10 + i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.fullName} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {(u.fullName ?? u.name ?? '?')[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-800">{u.fullName ?? u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : (u.joined ?? '—')}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-800">{u.wordsLearned ?? u.words ?? 0}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      🔥 {u.streak ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge active={u.isActive} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {hasPermission('USER', 'UPDATE') && (
                        <button
                          onClick={() => openEditModal(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                      )}
                      {/* Nút xóa — chỉ hiện nếu backend hỗ trợ soft delete */}
                      {hasPermission('USER', 'DELETE') && (
                        <button
                          onClick={() => setDeleteId(u.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"
                          title="Vô hiệu hóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-50 flex justify-end">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa */}
      <Dialog open={!!modal} onOpenChange={() => !isSaving && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Chỉnh sửa người dùng</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Họ và tên</Label><Input className="mt-1" value={form.fullName} onChange={e => setField('fullName', e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1 bg-gray-50 text-gray-400 cursor-not-allowed" value={form.email} readOnly /></div>
            <div className="flex items-center justify-between">
              <Label>Kích hoạt tài khoản</Label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setField('isActive', e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              ⚠️ Không thể thay đổi mật khẩu trực tiếp.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)} disabled={isSaving}>Hủy</Button>
            <Button onClick={handleSave} disabled={isSaving} className="min-w-[90px]">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Lưu lại'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm xóa/vô hiệu hóa */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Vô hiệu hóa tài khoản</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            Bạn có muốn vô hiệu hóa tài khoản người dùng này không? Họ sẽ không thể đăng nhập cho đến khi được kích hoạt lại.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await userAccountApi.update(deleteId, { isActive: false })
                  toast.success('Đã vô hiệu hóa tài khoản!')
                  setDeleteId(null)
                  fetchUsers()
                } catch (error) {
                  toast.error(error.message || 'Lỗi khi cập nhật!')
                }
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}