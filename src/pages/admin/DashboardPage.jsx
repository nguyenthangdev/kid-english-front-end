import { useVocab } from '@/contexts/VocabContext'
import { useQuote } from '@/contexts/QuoteContext'
import { useCategory } from '@/contexts/CategoryContext'
import { MOCK_USERS } from '@/utils/mockData'

export function DashboardPage() {
  const { vocabs }     = useVocab()
  const { quotes }     = useQuote()
  const { categories } = useCategory()

  const stats = [
    { icon: '👥', val: MOCK_USERS.length, label: 'Người dùng', bg: 'bg-blue-50',    ic: 'text-blue-500' },
    { icon: '📖', val: vocabs.length,     label: 'Từ vựng',    bg: 'bg-emerald-50', ic: 'text-emerald-500' },
    { icon: '💬', val: quotes.length,     label: 'Câu nói',    bg: 'bg-purple-50',  ic: 'text-purple-500' },
    { icon: '🏷️', val: categories.length, label: 'Thẻ',   bg: 'bg-pink-50',    ic: 'text-pink-500' },
  ]

  const recent = [
    { name: 'Nguyễn Minh Tuấn', action: 'Học 5 từ mới',              time: '2 phút trước'  },
    { name: 'Lê Thị Hoa',        action: 'Đăng ký tài khoản',         time: '15 phút trước' },
    { name: 'Phạm Văn Bình',     action: 'Hoàn thành streak 30 ngày', time: '1 giờ trước'   },
    { name: 'Trần Thị Mai',      action: 'Mở khóa sticker mới',       time: '2 giờ trước'   },
  ]

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-extrabold text-gray-800">{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">📈 Người dùng mới (7 ngày qua)</div>
          <div className="p-6 h-52 flex items-center justify-center bg-gray-50 text-gray-400 text-sm text-center">
            <div>
              <div className="text-4xl mb-2">📊</div>
              <div>Biểu đồ minh họa</div>
              <div className="text-xs mt-1">Kết nối API để hiển thị dữ liệu thật</div>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">🕐 Hoạt động gần đây</div>
          {recent.map((r, i) => (
            <div key={i} className={`px-5 py-3.5 flex items-center gap-3 ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{r.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-800 truncate">{r.name}</div>
                <div className="text-xs text-gray-500 truncate">{r.action}</div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}