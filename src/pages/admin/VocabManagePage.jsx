/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { adminVocabApi } from '@/apis/admin'
import { useVocabTags } from '@/contexts/admin/VocabTagsContext'
import { toast } from 'react-toastify'
import { ArrowBigDownDash, ImageIcon, Loader2, SquarePen, Trash2 } from 'lucide-react'
import { VocabModal } from '@/components/admin/VocabModal'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { formatVietnamDateTime } from '@/utils/formatVietnamDateTime';

import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'

export function VocabManagePage() {
  const { hasPermission } = useAdminAuth()
  const { state: { tags }, fetchTags } = useVocabTags()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlKeyword = searchParams.get('keyword') || ''
  // 1. Tạo State riêng biệt cho ô Input để gõ trơn tru
  const [inputValue, setInputValue] = useState(urlKeyword)

  // 2. Cho inputValue đi qua "bộ hãm phanh" 500ms
  const debouncedKeyword = useDebounce(inputValue, 500)

  // --- STATE CHO CURSOR PAGINATION ---
  const [vocabs, setVocabs] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false) // Trạng thái riêng cho nút Load More

  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hook search chỉ lọc trên những data đã được tải về
  // const { query, setQuery, filtered } = useSearch(vocabs, ['word', 'meaning'])

  // Tham số cursorToFetch: Nếu là null -> Tải lại từ đầu, Nếu có id -> Tải tiếp
  const fetchVocabularies = useCallback(async (cursorToFetch = null) => {
    try {
      // setIsLoading(cursorToFetch ? false : true)
      if (cursorToFetch) setIsFetchingMore(true)
      else setIsLoading(true)

      const params = { limit: 10 }

      if (debouncedKeyword && debouncedKeyword.trim() !== '') {
        params.keyword = debouncedKeyword.trim()
      }

      if (cursorToFetch) params.cursor = cursorToFetch

      const response = await adminVocabApi.getAll(params)

      const axiosData = response?.data || {}

      if (cursorToFetch) {
        setVocabs(prev => [...prev, ...axiosData])
      } else {
        setVocabs(axiosData)
      }

      setNextCursor(response.nextCursor)
      setHasMore(response.hasMore)

    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi tải danh sách từ vựng!')
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

    fetchVocabularies(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, fetchVocabularies])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const handleSearchChange = (value) => {
    setInputValue(value)
  }
  // Xử lý Lưu (Thêm/Sửa)
  const handleSave = async (form) => {
    try {
      setIsSaving(true)
      if (modal?.id) {
        const res = await adminVocabApi.update(modal.id, form)
        toast.success(res?.message)

        setVocabs(prev => prev.map(item => {
          if (item.id === modal.id) {
            // Lấy dữ liệu trả về từ API (hoặc từ form) đè lên dữ liệu cũ
            const updatedData = res?.data?.data || res?.data || form;
            return { ...item, ...updatedData };
          }
          return item;
        }))
      } else {
        await adminVocabApi.create(form)
        toast.success('Thêm từ vựng mới thành công!')
        fetchVocabularies(null)
      }
      setModal(null)
      // Thêm hoặc sửa xong thì quét lại từ đầu trang để thấy dòng mới nhất
      // fetchVocabularies(null) 
    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi lưu từ vựng!')
    } finally {
      setIsSaving(false)
    }
  }

  // Xử lý Xóa
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await adminVocabApi.remove(deleteId)
      toast.success(res?.message)
      setVocabs(prev => prev.filter(item => item.id !== deleteId))
      setDeleteId(null)
      // fetchVocabularies(null) 
    } catch (error) {
      toast.error(error.response.data.message || 'Lỗi khi xóa từ vựng!')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader 
        title="Từ vựng của bé" 
        action={hasPermission('VOCABULARY', 'CREATE') ? "Thêm từ vựng" : null} 
        onAction={() => setModal({})} 
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[300px]">

        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <SearchBar
            placeholder="Tìm từ vựng..."
            value={inputValue}
            onChange={handleSearchChange}
          />
          <span className="text-sm text-gray-500">{vocabs.length} từ vựng</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                {['STT', 'Hình ảnh', 'Từ vựng', 'Phiên âm', 'Ý nghĩa', 'Tên thẻ', 'Cập nhật lần cuối', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vocabs.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-500">
                    Không tìm thấy từ vựng nào.
                  </td>
                </tr>
              )}

              {/* Render mảng vocabs (chứa những item đang có trên máy) */}
              {vocabs.map((v, i) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.word} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center border border-violet-100 text-violet-300">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-lg font-extrabold text-gray-800">{v.word}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 font-mono">{v.pronunciation}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{v.meaning}</td>
                  <td className="px-5 py-4">
                    {v.tag ? (
                      <CategoryBadge value={v.tag.name} color={v.tag.colorCode} />
                    ) : (
                      <span className="text-gray-400 text-xs italic">Không có thẻ</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatVietnamDateTime(v.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {hasPermission('VOCABULARY', 'UPDATE') && (
                        <button onClick={() => setModal(v)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"><SquarePen className="w-4 h-4" /></button>
                      )}
                      {hasPermission('VOCABULARY', 'DELETE') && (
                        <button onClick={() => setDeleteId(v.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nút Tải Thêm (Load More) */}
        {hasMore && (
          <div className="px-5 py-4 border-t border-gray-50 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchVocabularies(nextCursor)}
              disabled={isFetchingMore}
              className="rounded-full px-6"
            >
              {isFetchingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isFetchingMore ?
                ('Đang tải...') :
                (
                  <>
                    <ArrowBigDownDash />
                    {' '}Tải thêm từ vựng
                  </>
                )}
            </Button>
          </div>
        )}
      </div>

      <VocabModal open={!!modal} item={modal} tags={tags} onClose={() => !isSaving && setModal(null)} onSave={handleSave} isSaving={isSaving} />

      <ConfirmDialog open={!!deleteId} onClose={() => !isDeleting && setDeleteId(null)} onConfirm={handleDelete} title="Xóa từ vựng" description={`Bạn có chắc chắn muốn xóa từ vựng này không?`} isLoading={isDeleting} />
    </div>
  )
}