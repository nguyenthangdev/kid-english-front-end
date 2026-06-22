import { useState } from 'react'
import { useVocab } from '@/contexts/VocabContext'
import { useCategory } from '@/contexts/CategoryContext'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import { SearchBar } from '@/components/SearchBar'
import { CategoryBadge } from '@/components/CategoryBadge'
import { Pagination } from '@/components/Pagination'

export function VocabularyPage() {
  const { vocabs } = useVocab()
  const { categories } = useCategory()
  const [activeCat, setActiveCat] = useState('all')

  const filtered_by_cat = activeCat === 'all' ? vocabs : vocabs.filter(v => v.category === activeCat)
  const { query, setQuery, filtered } = useSearch(filtered_by_cat, ['word', 'meaning'])
  const { page, setPage, totalPages, paged } = usePagination(filtered)

  return (
    <div>
      <div className="mb-5">
        <SearchBar placeholder="Tìm từ vựng..." value={query} onChange={v => { setQuery(v); setPage(1) }} />
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => { setActiveCat('all'); setPage(1) }}
          className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${activeCat === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
          Tất cả
        </button>
        {categories.map(c => (
          <button key={c.name} onClick={() => { setActiveCat(c.name); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${activeCat === c.name ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {paged.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-xl font-extrabold text-gray-800 mb-0.5">{v.word}</div>
            <div className="text-xs text-gray-400 mb-1">{v.phonetic}</div>
            <div className="text-sm text-gray-600 mb-3">{v.meaning}</div>
            <CategoryBadge value={v.category} />
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}