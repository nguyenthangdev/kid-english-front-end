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
      {/* Câu nói hôm nay */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {todayQuote && (
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-gray-200 border-l-4 border-l-emerald-500 p-7 mb-6">
              <div className="text-xs font-bold text-yellow-500 mb-3">☀️ Hôm nay</div>
              <div className="text-xl font-bold text-gray-800 italic mb-2">
                "{todayQuote.contentEn ?? todayQuote.text}"
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {todayQuote.contentVn ?? todayQuote.trans}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-600">— {todayQuote.author}</div>
                <div className="flex gap-2">
                  <CategoryBadge
                    value={todayQuote.tag?.name ?? todayQuote.tag}
                    color={todayQuote.tag?.colorCode}
                    type="tag"
                  />
                  <button className="text-xs border border-gray-300 rounded-full px-3 py-1 font-bold text-gray-600 hover:bg-white transition-all">
                    🔊 Nghe
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-lg font-extrabold text-gray-800 mb-4">Thư viện câu nói</h2>

          {/* Search + Tag filter */}
          <div className="flex gap-3 flex-wrap mb-5">
            <SearchBar placeholder="Tìm câu nói..." value={query} onChange={setQuery} />
            <div className="flex gap-2 flex-wrap">
              {/* Nút "Tất cả" */}
              <button
                onClick={() => setTag('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tag === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tag === tagName ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
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
                <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all">
                  <div className="text-sm font-bold text-gray-800 italic mb-2">
                    "{q.contentEn ?? q.text}"
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {q.contentVn ?? q.trans}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-600">— {q.author}</div>
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