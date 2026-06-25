/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { adminRoleApi } from '@/apis/admin'
// Tự import useRolesContext của bạn nếu cần
import { toast } from 'react-toastify'
import { ArrowBigDownDash, Loader2, SquarePen, Trash2 } from 'lucide-react'
import { RoleModal } from '@/components/admin/RoleModal'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { formatVietnamDateTime } from '@/utils/formatVietnamDateTime'

export function RoleManagePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlKeyword = searchParams.get('keyword') || ''
  
  const [inputValue, setInputValue] = useState(urlKeyword)
  const debouncedKeyword = useDebounce(inputValue, 500)
  
  const [roles, setRoles] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRoles = useCallback(async (cursorToFetch = null) => {
    try {
      if (cursorToFetch) setIsFetchingMore(true)
      else setIsLoading(true)

      const params = { limit: 10 }
      if (debouncedKeyword && debouncedKeyword.trim() !== '') {
        params.keyword = debouncedKeyword.trim()
      }
      if (cursorToFetch) params.cursor = cursorToFetch

      const response = await adminRoleApi.getAll(params)
      console.log('response from role: ', response)
      const payload = response?.data
      
      if (cursorToFetch) setRoles(prev => [...prev, ...(payload || [])]) 
      else setRoles(payload || [])
      
      setNextCursor(response.nextCursor)
      setHasMore(response.hasMore)

    } catch (error) {
      // toast.error(error.message || 'Lỗi khi tải danh sách quyền!')
      console.log('Lỗi khi tải danh sách quyền!', error.message)
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [debouncedKeyword])

  useEffect(() => {
    const currentUrlKeyword = searchParams.get('keyword') || ''
    if (debouncedKeyword !== currentUrlKeyword) {
      if (debouncedKeyword) searchParams.set('keyword', debouncedKeyword)
      else searchParams.delete('keyword')
      setSearchParams(searchParams)
    }
    fetchRoles(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, fetchRoles])

  const handleSave = async (form) => {
    try {
      setIsSaving(true)
      if (modal?.id) {
        const res = await adminRoleApi.update(modal.id, form)
        console.log('res update: ', res)
        toast.success('Cập nhật quyền thành công!')
      } else {
        await adminRoleApi.create(form)
        toast.success('Tạo quyền mới thành công!')
      }
      setModal(null)
      fetchRoles(null) 
    } catch (error) {
      console.log('error: ', error.message)
      // toast.error(error.message || 'Lỗi khi lưu!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await adminRoleApi.remove(deleteId)
      toast.success('Đã xóa quyền!')
      setDeleteId(null)
      fetchRoles(null) 
    } catch (error) {
      // toast.error(error.message || 'Lỗi khi xóa!')
      console.log('Lỗi khi xóa role', error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Nhóm quyền" action="Tạo nhóm quyền" onAction={() => setModal({})} />
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar placeholder="Tìm theo tên, mã..." value={inputValue} onChange={setInputValue} />
          <span className="text-sm text-gray-500">{roles.length} nhóm quyền</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                {['STT', 'Mã Code', 'Tên nhóm', 'Mô tả', 'Thành viên', 'Cập nhật lần cuối', 'Thao tác'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.length === 0 && !isLoading && (
                <tr><td colSpan="6" className="px-5 py-8 text-center text-gray-500">Không tìm thấy dữ liệu.</td></tr>
              )}
              
              {roles.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-gray-500">{r.code}</td>
                  <td className="px-5 py-4"><span className="text-sm font-bold text-violet-700 bg-violet-50 px-3 py-1 rounded-full">{r.name}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-500 max-w-[200px] truncate">{r.description}</td>
                  {/* Sử dụng userCount do Backend tự động ánh xạ qua loadRelationCountAndMap */}
                  <td className="px-5 py-4 text-sm font-bold text-gray-800">{r.userCount || 0} người</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatVietnamDateTime(r.updatedAt)}</td>
                  <td className="px-5 py-4">
                    {/* THÊM LOGIC KIỂM TRA Ở ĐÂY */}
                    {r.code !== 'ADMIN' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setModal(r)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                        <button onClick={() => setDeleteId(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      // Hiển thị một badge nhỏ để báo hiệu đây là Role mặc định của hệ thống
                      <span className="text-xs italic text-gray-400 bg-gray-50 px-2 py-1 rounded">Mặc định</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {hasMore && (
          <div className="px-5 py-4 border-t border-gray-50 flex justify-center">
            <Button variant="outline" onClick={() => fetchRoles(nextCursor)} disabled={isFetchingMore} className="rounded-full px-6">
              {isFetchingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowBigDownDash className="w-4 h-4 mr-2" />}
              {isFetchingMore ? 'Đang tải...' : 'Tải thêm quyền'}
            </Button>
          </div>
        )}
      </div>

      <RoleModal open={!!modal} item={modal} onClose={() => !isSaving && setModal(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} onClose={() => !isDeleting && setDeleteId(null)} onConfirm={handleDelete} title="Xóa nhóm quyền" description={`Bạn có chắc chắn muốn xóa nhóm quyền này? Hành động không thể hoàn tác.`} isLoading={isDeleting} />
    </div>
  )
}