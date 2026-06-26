import { useState, useEffect, useCallback } from 'react'
import { vocabApi } from '@/apis/client/index'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { toast } from 'react-toastify'
import { ArrowBigDownDash, Loader2 } from 'lucide-react'

// -- CONTEXT CŨ (giữ lại để rollback nhanh nếu cần) --
// import { useVocab }     from '@/contexts/VocabContext'
// import { useCategory }  from '@/contexts/CategoryContext'
// import { usePagination } from '@/hooks/usePagination'
// import { Pagination }   from '@/components/Pagination'

const LIMIT = 12 // số card mỗi lần load

export function VocabularyPage() {
  // --- Cursor Pagination State ---
  const [vocabs, setVocabs] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  // --- UI State ---
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)   // loading lần đầu
  const [isFetchingMore, setIsFetchingMore] = useState(false) // loading nút "Tải thêm"

  // --- Search & Filter State ---
  const [searchParams, setSearchParams] = useSearchParams()

  const urlKeyword = searchParams.get('keyword') || ''
  const [inputValue, setInputValue] = useState(urlKeyword)
  const debouncedKeyword = useDebounce(inputValue, 500)

  const urlTag = searchParams.get('tag') || 'all'
  const [activeCat, setActiveCat] = useState(urlTag)

  // --- Fetch tags một lần khi mount ---
  useEffect(() => {
    vocabApi.getAllTags()
      .then(res => {
        const list = res?.data ?? res ?? []
        setCategories(list)
      })
      .catch(() => { }) // không crash nếu endpoint chưa có
  }, [])

  // --- Hàm fetch vocab chính ---
  // cursorToFetch = null  → tải lại từ đầu (khi đổi filter/search)
  // cursorToFetch = string → tải thêm (Tải thêm)
  const fetchVocabs = useCallback(async (cursorToFetch = null) => {
    try {
      if (cursorToFetch) setIsFetchingMore(true)
      else setIsLoading(true)

      const params = { limit: LIMIT }
      if (activeCat !== 'all') params.tagId = activeCat
      if (debouncedKeyword && debouncedKeyword.trim() !== '') {
        params.keyword = debouncedKeyword.trim()
      }
      if (cursorToFetch) params.cursor = cursorToFetch

      const response = await vocabApi.getAll(params)

      // Backend trả: { data: [...], nextCursor, hasMore }
      const dataArray = response?.data ?? []
      const newCursor = response?.nextCursor ?? null
      const newHasMore = response?.hasMore ?? false

      if (cursorToFetch) {
        setVocabs(prev => [...prev, ...dataArray]) // append
      } else {
        setVocabs(dataArray)                       // reset
      }
      setNextCursor(newCursor)
      setHasMore(newHasMore)
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải từ vựng!')
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [activeCat, debouncedKeyword]) // re-create khi đổi category hoặc keyword

  // Reset & fetch lại khi activeCat hoặc keyword thay đổi
  useEffect(() => {
    const currentUrlKeyword = searchParams.get('keyword') || ''
    const currentUrlTag = searchParams.get('tag') || 'all'

    let shouldUpdateParams = false

    if (debouncedKeyword !== currentUrlKeyword) {
      if (debouncedKeyword) {
        searchParams.set('keyword', debouncedKeyword)
      } else {
        searchParams.delete('keyword')
      }
      shouldUpdateParams = true
    }

    if (activeCat !== currentUrlTag) {
      if (activeCat !== 'all') {
        searchParams.set('tag', activeCat)
      } else {
        searchParams.delete('tag')
      }
      shouldUpdateParams = true
    }

    if (shouldUpdateParams) {
      setSearchParams(searchParams)
    }

    fetchVocabs(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVocabs, debouncedKeyword, activeCat])

  return (
    <div>
      {/* Search */}
      <div className="mb-5">
        <SearchBar
          placeholder="Tìm từ vựng..."
          value={inputValue}
          onChange={setInputValue}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setActiveCat('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${activeCat === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
        >
          Tất cả
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${activeCat === c.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Loading lần đầu */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Empty state */}
          {vocabs.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-sm">Không tìm thấy từ vựng nào.</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {vocabs.map(v => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {v.imageUrl ? (
                    <img
                      src={v.imageUrl}
                      alt={v.word}
                      className="w-full h-28 object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <div className="text-4xl mb-3">📖</div>
                  )}
                  <div className="text-xl font-extrabold text-gray-800 mb-0.5">{v.word}</div>
                  <div className="text-xs text-gray-400 mb-1">{v.pronunciation}</div>
                  <div className="text-sm text-gray-600 mb-3">{v.meaning}</div>
                  {/* Hỗ trợ cả tag object (API mới) lẫn category string (mock cũ) */}
                  <CategoryBadge value={v.tag?.name ?? v.category} color={v.tag?.colorCode} />
                </div>
              ))}
            </div>
          )}

          {/* Nút Tải thêm */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchVocabs(nextCursor)}
                disabled={isFetchingMore}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-emerald-400 text-emerald-600 font-bold text-sm hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isFetchingMore
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <ArrowBigDownDash className="w-4 h-4" />
                }
                {isFetchingMore ? 'Đang tải...' : 'Tải thêm từ vựng'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}