import { useState, useEffect, useCallback } from 'react'
import { quoteApi } from '@/apis/client/index'
import { useSearch } from '@/hooks/useSearch'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

// -- CONTEXT CŨ (giữ lại để rollback nhanh nếu cần) --
// import { useQuote } from '@/contexts/QuoteContext'
// const { quotes } = useQuote()
// const TAGS = ['all', 'study', 'motivation', 'friendship']

export function QuotesPage() {
  const [quotes,     setQuotes]     = useState([])
  const [todayQuote, setTodayQuote] = useState(null)
  const [tags,       setTags]       = useState([])
  const [tag,        setTag]        = useState('all')
  const [isLoading,  setIsLoading]  = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)

      const [allRes, todayRes, tagsRes] = await Promise.allSettled([
        quoteApi.getAll(),
        quoteApi.getToday(),
        quoteApi.getAllTags(),
      ])

      // Bóc tách danh sách câu nói
      const quoteList = allRes.status === 'fulfilled'
        ? (allRes.value?.data ?? allRes.value ?? [])
        : []

      // Bóc tách câu hôm nay — fallback tìm trong list nếu endpoint riêng fail
      let today = null
      if (todayRes.status === 'fulfilled' && todayRes.value) {
        today = todayRes.value?.data ?? todayRes.value
      } else {
        today = quoteList.find(q => q.isToday) ?? null
      }

      // Bóc tách tags để làm filter pill
      let tagList = []
      if (tagsRes.status === 'fulfilled' && tagsRes.value) {
        tagList = tagsRes.value?.data ?? tagsRes.value ?? []
      } else if (quoteList.length > 0) {
        // Fallback: distinct từ trường tag của quote
        const seen = new Set()
        tagList = quoteList
          .filter(q => q.tag)
          .map(q => q.tag)
          .filter(t => {
            const key = t.id ?? t.name
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
      }

      setQuotes(quoteList)
      setTodayQuote(today)
      setTags(tagList)
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải câu nói!')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Filter library — loại trừ câu hôm nay, lọc theo tag
  const library = quotes.filter(q => {
    const isNotToday = q.id !== todayQuote?.id && !q.isToday
    if (tag === 'all') return isNotToday
    const qTagName = q.tag?.name ?? q.tag
    return isNotToday && qTagName === tag
  })

  const { query, setQuery, filtered } = useSearch(library, ['contentEn', 'contentVn', 'author', 'text'])

  return (
    <div>
      {/* Page Header (Tùy chọn, giống thiết kế) */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
          <span className="text-lg">💬</span>
        </div>
        <h1 className="text-xl font-extrabold text-gray-800">Câu nói mỗi ngày</h1>
      </div>

      {/* Câu nói hôm nay */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {todayQuote && (
            <div className="bg-emerald-50/30 rounded-3xl border-2 border-emerald-400 p-8 mb-10 relative overflow-hidden">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 mb-4">
                <span className="text-yellow-500 text-lg">🌟</span> Hôm nay
              </div>
              <div className="text-2xl font-bold text-gray-800 italic mb-2">
                "{todayQuote.contentEn ?? todayQuote.text}"
              </div>
              <div className="text-base text-gray-500 mb-4">
                {todayQuote.contentVn ?? todayQuote.trans}
              </div>
              <div className="text-sm font-bold text-gray-800 mb-6">
                — {todayQuote.author}
              </div>
              <div className="flex items-center gap-3">
                <CategoryBadge
                  value={todayQuote.tag?.name ?? todayQuote.tag}
                  color={todayQuote.tag?.colorCode}
                  type="tag"
                />
                <button className="flex items-center gap-2 text-xs border border-gray-300 bg-white rounded-full px-4 py-2 font-bold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm">
                  <span>🔊</span> Nghe
                </button>
              </div>
            </div>
          )}

          <h2 className="text-lg font-extrabold text-gray-800 mb-4">Thư viện câu nói</h2>

          {/* Search + Tag filter */}
          <div className="flex gap-3 flex-wrap items-center mb-6">
            <div className="w-64">
              <SearchBar placeholder="Tìm câu nói..." value={query} onChange={setQuery} />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {/* Nút "Tất cả" */}
              <button
                onClick={() => setTag('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${tag === 'all' ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'}`}
              >
                Tất cả
              </button>
              {/* Dynamic tags từ API */}
              {tags.map(t => {
                const tagName = t.name ?? t
                return (
                  <button
                    key={t.id ?? tagName}
                    onClick={() => setTag(tagName)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${tag === tagName ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'}`}
                  >
                    {t.label ?? tagName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quote Library Grid */}
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <div className="text-4xl mb-3">💬</div>
              <div className="text-sm">Không tìm thấy câu nói nào.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(q => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="text-base font-extrabold text-gray-800 italic mb-2 leading-relaxed">
                      "{q.contentEn ?? q.text}"
                    </div>
                    <div className="text-sm text-gray-500 mb-6">
                      {q.contentVn ?? q.trans}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-sm font-bold text-gray-600">— {q.author}</div>
                    <CategoryBadge
                      value={q.tag?.name ?? q.tag}
                      color={q.tag?.colorCode}
                      type="tag"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}