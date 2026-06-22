import { useState } from 'react'
import { useQuote } from '@/contexts/QuoteContext'
import { useSearch } from '@/hooks/useSearch'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'

const TAGS = ['all', 'study', 'motivation', 'friendship']

export function QuotesPage() {
  const { quotes } = useQuote()
  const [tag, setTag] = useState('all')
  const todayQuote = quotes.find(q => q.isToday)
  const library = quotes.filter(q => !q.isToday && (tag === 'all' || q.tag === tag))
  const { query, setQuery, filtered } = useSearch(library, ['text', 'author'])

  return (
    <div>
      {todayQuote && (
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-gray-200 border-l-4 border-l-emerald-500 p-7 mb-6">
          <div className="text-xs font-bold text-yellow-500 mb-3">☀️ Hôm nay</div>
          <div className="text-xl font-bold text-gray-800 italic mb-2">"{todayQuote.text}"</div>
          <div className="text-sm text-gray-500 mb-3">{todayQuote.trans}</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-600">— {todayQuote.author}</div>
            <div className="flex gap-2">
              <CategoryBadge value={todayQuote.tag} type="tag" />
              <button className="text-xs border border-gray-300 rounded-full px-3 py-1 font-bold text-gray-600 hover:bg-white transition-all">🔊 Nghe</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-extrabold text-gray-800 mb-4">Thư viện câu nói</h2>

      <div className="flex gap-3 flex-wrap mb-5">
        <SearchBar placeholder="Tìm câu nói..." value={query} onChange={setQuery} />
        <div className="flex gap-2">
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tag === t ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              {t === 'all' ? 'Tất cả' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(q => (
          <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all">
            <div className="text-sm font-bold text-gray-800 italic mb-2">"{q.text}"</div>
            <div className="text-xs text-gray-500 mb-3">{q.trans}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-600">— {q.author}</div>
              <CategoryBadge value={q.tag} type="tag" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}