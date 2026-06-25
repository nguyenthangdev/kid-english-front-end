/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { CategoryBadge } from '@/components/CategoryBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { TagsModal } from '@/components/admin/TagsModal'
import { useVocabTags } from '@/contexts/admin/VocabTagsContext'
import { vocabTagsApi } from '@/apis/admin'
import { toast } from 'react-toastify'
import { Loader2, SquarePen, Trash2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components'
import { formatVietnamDateTime } from '@/utils/formatVietnamDateTime'

export function VoCabTagsManagePage() {
  const { fetchTags: refreshContextTags } = useVocabTags()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const urlKeyword = searchParams.get('keyword') || ''
  
  const [inputValue, setInputValue] = useState(urlKeyword)
  const debouncedKeyword = useDebounce(inputValue, 500)

  const [tags, setTags] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLocalTags = useCallback(async (cursorToFetch = null) => {
    try {
      if (cursorToFetch) setIsFetchingMore(true)
      else setIsLoading(true)

      const params = { limit: 10 }
      if (debouncedKeyword && debouncedKeyword.trim() !== '') {
        params.keyword = debouncedKeyword.trim()
      }
      if (cursorToFetch) params.cursor = cursorToFetch

      const response = await vocabTagsApi.getAll(params)
      const payload = response?.data?.data ? response.data : response

      if (cursorToFetch) {
        setTags(prev => [...prev, ...(payload.data || [])])
      } else {
        setTags(payload.data || [])
      }
      
      setNextCursor(payload.nextCursor)
      setHasMore(payload.hasMore)

    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải danh sách thẻ!')
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [debouncedKeyword])

  useEffect(() => {
    const currentUrlKeyword = searchParams.get('keyword') || ''
    
    if (debouncedKeyword !== currentUrlKeyword) {
      if (debouncedKeyword) {
        searchParams.set('keyword', debouncedKeyword)
      } else {
        searchParams.delete('keyword')
      }
      setSearchParams(searchParams)
    }

    fetchLocalTags(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, fetchLocalTags])

  const handleSearchChange = (value) => {
    setInputValue(value)
  }
  // useEffect(() => {
  //   fetchTags() 
  // }, [fetchTags])

  const handleSave = async (form) => {
    try {
      setIsSaving(true)
      const payload = {
        name: form.name,
        colorCode: form.colorCode,
        type: 'VOCAB' 
      }

      if (modal?.id) {
        await vocabTagsApi.update(modal.id, payload)
        toast.success('Cập nhật thẻ thành công!')
      } else {
        await vocabTagsApi.create(payload)
        toast.success('Thêm thẻ mới thành công!')
      }
      
      setModal(null)
      fetchLocalTags(null)
      refreshContextTags()
    } catch (error) {
      // toast.error(error.message || 'Lỗi khi lưu thẻ!')
      console.log('Lỗi khi lưu thẻ! ', error.message )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await vocabTagsApi.remove(deleteId)
      toast.success('Đã xóa thẻ thành công!')
      setDeleteId(null)
      
      fetchLocalTags(null)
      refreshContextTags()
      
    } catch (error) {
      toast.error(error.message || 'Lỗi khi xóa thẻ!')
    } finally {
      setIsDeleting(false)
    }
  }
  
return (
    <div>
      <PageHeader title="Các thẻ từ vựng" action="Thêm thẻ" onAction={() => setModal({})} />
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar 
            placeholder="Tìm thẻ từ vựng..." 
            value={inputValue} 
            onChange={handleSearchChange} 
          />
          <span className="text-sm text-gray-500">{tags.length} thẻ hiển thị</span>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              {['STT', 'Slug', 'Tên thẻ', 'Màu sắc', 'Cập nhật lần cuối', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tags.length === 0 && !isLoading && (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                  Không tìm thấy thẻ nào.
                </td>
              </tr>
            )}
            
            {tags.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-4 font-mono text-sm text-gray-500">{c.slug}</td>
                <td className="px-5 py-4 font-bold text-gray-800">{c.name}</td>
                <td className="px-5 py-4">
                  <CategoryBadge value={c.name} color={c.colorCode} />
                </td>
                <td className="px-5 py-4 text-sm text-gray-700">{formatVietnamDateTime(c.updatedAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                      <button onClick={() => setModal(c)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hasMore && (
          <div className="px-5 py-4 border-t border-gray-50 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => fetchLocalTags(nextCursor)}
              disabled={isFetchingMore}
              className="rounded-full px-6"
            >
              {isFetchingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isFetchingMore ? 'Đang tải...' : '⬇️ Tải thêm thẻ'}
            </Button>
          </div>
        )}
      </div>

      <TagsModal open={!!modal} item={modal} onClose={() => !isSaving && setModal(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} onClose={() => !isDeleting && setDeleteId(null)} onConfirm={handleDelete} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa thẻ này không? Hành động này không thể hoàn tác." isLoading={isDeleting} />
    </div>
  )
}