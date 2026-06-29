/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { adminQuoteApi } from '@/apis/admin'
import { useQuoteTags } from '@/contexts/admin/QuoteTagsContext'
import { toast } from 'react-toastify'
import { ArrowBigDownDash, Loader2, SquarePen, Trash2 } from 'lucide-react'
import { QuoteModal } from '@/components/admin/QuoteModal'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { formatVietnamDateTime } from '@/utils/formatVietnamDateTime'

export function QuoteManagePage() {
  const { state: { tags }, fetchTags } = useQuoteTags()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const urlKeyword = searchParams.get('keyword') || ''
  const [inputValue, setInputValue] = useState(urlKeyword)
  const debouncedKeyword = useDebounce(inputValue, 500)
  
  // --- STATE CHO CURSOR PAGINATION ---
  const [quotes, setQuotes] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false) 
  
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchQuotes = useCallback(async (cursorToFetch = null) => {
    try {
      if (cursorToFetch) setIsFetchingMore(true)
      else setIsLoading(true)

      const params = { limit: 10 }

      if (debouncedKeyword && debouncedKeyword.trim() !== '') {
        params.keyword = debouncedKeyword.trim()
      }

      if (cursorToFetch) params.cursor = cursorToFetch

      const response = await adminQuoteApi.getAll(params)
      
      // Xử lý bóc tách payload cẩn thận tránh lỗi
      const payload = response?.data?.data ? response.data : response
      const dataArray = payload?.data || []
      
      if (cursorToFetch) {
        setQuotes(prev => [...prev, ...dataArray]) 
      } else {
        setQuotes(dataArray) 
      }
      
      setNextCursor(payload?.nextCursor)
      setHasMore(payload?.hasMore)

    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi tải danh sách câu nói!')
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

    fetchQuotes(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, fetchQuotes])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const handleSearchChange = (value) => {
    setInputValue(value)
  }

  const handleSave = async (form) => {
    try {
      setIsSaving(true)
      if (modal?.id) {
        await adminQuoteApi.update(modal.id, form)
        toast.success('Cập nhật câu nói thành công!')
      } else {
        await adminQuoteApi.create(form)
        toast.success('Thêm câu nói mới thành công!')
      }
      setModal(null)
      fetchQuotes(null) 
    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi lưu câu nói!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await adminQuoteApi.remove(deleteId)
      toast.success(res.message)
      setDeleteId(null)
      fetchQuotes(null) 
    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi xóa câu nói!')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Câu nói mỗi ngày" action="Thêm câu nói" onAction={() => setModal({})} />
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[300px]">
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar 
            placeholder="Tìm theo nội dung, tác giả..." 
            value={inputValue} 
            onChange={handleSearchChange} 
          />
          <span className="text-sm text-gray-500">{quotes.length} câu nói</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                {['STT', 'Câu nói', 'Tác giả', 'Tên thẻ', 'Cập nhật lần cuối', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                    Không tìm thấy câu nói nào.
                  </td>
                </tr>
              )}
              
              {quotes.map((q, i) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                  
                  <td className="px-5 py-4 max-w-sm">
                    <div className="text-sm font-bold text-gray-800 line-clamp-2">"{q.contentEn}"</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{q.contentVn}</div>
                  </td>
                  
                  <td className="px-5 py-4 text-sm font-bold text-gray-600">
                    {q.author || <span className="text-gray-400 font-normal italic">Khuyết danh</span>}
                  </td>
                  
                  <td className="px-5 py-4">
                    {q.tag ? (
                      <CategoryBadge value={q.tag.name} color={q.tag.colorCode} />
                    ) : (
                      <span className="text-gray-400 text-xs italic">Không có thẻ</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatVietnamDateTime(q.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(q)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteId(q.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {hasMore && (
          <div className="px-5 py-4 border-t border-gray-50 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => fetchQuotes(nextCursor)}
              disabled={isFetchingMore}
              className="rounded-full px-6"
            >
              {isFetchingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isFetchingMore ? 
              ('Đang tải...') : 
              (
                <>
                  <ArrowBigDownDash className="w-4 h-4 mr-2" /> 
                  Tải thêm câu nói
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <QuoteModal open={!!modal} item={modal} tags={tags} onClose={() => !isSaving && setModal(null)} onSave={handleSave} isSaving={isSaving} />
      
      <ConfirmDialog open={!!deleteId} onClose={() => !isDeleting && setDeleteId(null)} onConfirm={handleDelete} title="Xóa câu nói" description={`Bạn có chắc chắn muốn xóa câu nói này không?`} isLoading={isDeleting} />
    </div>
  )
}