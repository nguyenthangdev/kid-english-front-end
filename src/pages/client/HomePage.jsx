import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDashboardApi } from '@/apis/client/index'

export function HomePage() {
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    userDashboardApi.getDashboard()
      .then(res => setDashboardData(res?.data ?? res))
      .catch(console.error)
  }, [])

  const { streak, statistics, vocabularyProgress, quoteOfDay } = dashboardData || {}

  // Stats lấy từ API
  const stats = [
    { icon: '⭐', val: statistics?.totalStars ?? 0, label: 'Sao' },
    { icon: '📈', val: streak?.currentStreak ?? 0, label: 'Ngày liên tiếp' },
    { icon: '📚', val: `${vocabularyProgress?.mastered ?? 0}/${vocabularyProgress?.total ?? 0}`, label: 'Từ đã học' },
    { icon: '🎁', val: '0', label: 'Sticker' }, // MOCK vì API chưa có stickers
  ]

  const explore = [
    { icon: '📖', bg: 'bg-blue-100',    name: 'Từ vựng của Bé',   desc: 'Khám phá từ mới mỗi ngày',       to: '/vocabulary' },
    { icon: '💬', bg: 'bg-pink-100',    name: 'Câu nói mỗi ngày', desc: 'Học qua những câu nói hay',       to: '/quotes' },
    { icon: '🎮', bg: 'bg-emerald-100', name: 'Trò chơi học tập', desc: 'Vừa chơi vừa học tiếng Anh',      to: '/game' },
    { icon: '🎁', bg: 'bg-pink-100',    name: 'Sticker',          desc: 'Sưu tầm sticker đáng yêu',        to: '/sticker' },
    { icon: '🏆', bg: 'bg-yellow-100',  name: 'Thành tích',       desc: 'Xem huy hiệu của bạn',            to: '/achievement' },
    { icon: '👨‍👩‍👧', bg: 'bg-purple-100', name: 'Góc Phụ Huynh',   desc: 'Dành cho bố mẹ và thầy cô',      to: '/parent' },
  ]

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-200 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-extrabold text-gray-800">{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Câu nói hôm nay */}
      {quoteOfDay && (
        <div className="bg-white rounded-2xl border border-gray-200 border-l-4 border-l-emerald-500 p-6 mb-6">
          <div className="text-xs font-bold text-yellow-500 mb-2">✨ Câu nói mỗi ngày</div>
          <div className="text-lg font-bold text-gray-800 italic mb-1">
            "{quoteOfDay.contentEn}"
          </div>
          <div className="text-sm text-gray-500 mb-1">
            {quoteOfDay.contentVn}
          </div>
          <div className="text-sm font-bold text-gray-600">— {quoteOfDay.author || 'Unknown'}</div>
        </div>
      )}

      {/* Explore Grid */}
      <h2 className="text-lg font-extrabold text-gray-800 mb-4">Khám phá</h2>
      <div className="grid grid-cols-3 gap-4">
        {explore.map(e => (
          <button
            key={e.to}
            onClick={() => navigate(e.to)}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:border-emerald-400 hover:shadow-md transition-all text-left"
          >
            <div className={`w-11 h-11 rounded-xl ${e.bg} flex items-center justify-center text-xl flex-shrink-0`}>
              {e.icon}
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-800">{e.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{e.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}