import { useState, useEffect } from 'react'
import { adminDashboardApi } from '@/apis/admin'
import { Loader2 } from 'lucide-react'

// -- MOCK DATA CŨ (giữ lại để rollback nhanh nếu cần) --
// import { useVocab }     from '@/contexts/VocabContext'
// import { useQuote }     from '@/contexts/QuoteContext'
// import { useCategory }  from '@/contexts/CategoryContext'
// import { MOCK_USERS }   from '@/utils/mockData'

// Skeleton card dùng khi đang loading
function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-100 rounded w-16" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [stats,           setStats]           = useState(null)
  const [recentActivity,  setRecentActivity]  = useState([])
  const [isLoading,       setIsLoading]       = useState(true)

  // Hardcode fallback cho "Hoạt động gần đây" nếu API chưa có
  const FALLBACK_RECENT = [
    { name: 'Nguyễn Minh Tuấn', action: 'Học 5 từ mới',              time: '2 phút trước'  },
    { name: 'Lê Thị Hoa',        action: 'Đăng ký tài khoản',         time: '15 phút trước' },
    { name: 'Phạm Văn Bình',     action: 'Hoàn thành streak 30 ngày', time: '1 giờ trước'   },
    { name: 'Trần Thị Mai',      action: 'Mở khóa sticker mới',       time: '2 giờ trước'   },
  ]

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true)

        const [statsRes, activityRes] = await Promise.allSettled([
          adminDashboardApi.getStats(),
          adminDashboardApi.getRecentActivity(),
        ])

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value?.data ?? statsRes.value)
        }

        if (activityRes.status === 'fulfilled' && activityRes.value) {
          const list = activityRes.value?.data ?? activityRes.value ?? []
          setRecentActivity(list.length > 0 ? list : FALLBACK_RECENT)
        } else {
          setRecentActivity(FALLBACK_RECENT)
        }
      } catch {
        // Không crash khi API chưa có — dùng fallback
        setRecentActivity(FALLBACK_RECENT)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Build stats cards từ API response hoặc hiển thị 0/0 khi chưa có
  const statCards = [
    { icon: '👥', val: stats?.totalUsers     ?? 0, label: 'Người dùng', bg: 'bg-blue-50',    ic: 'text-blue-500' },
    { icon: '📖', val: stats?.totalVocabs    ?? 0, label: 'Từ vựng',    bg: 'bg-emerald-50', ic: 'text-emerald-500' },
    { icon: '💬', val: stats?.totalQuotes    ?? 0, label: 'Câu nói',    bg: 'bg-purple-50',  ic: 'text-purple-500' },
    { icon: '🏷️', val: stats?.totalTags     ?? 0, label: 'Thẻ',        bg: 'bg-pink-50',    ic: 'text-pink-500' },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array(4).fill(null).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-800">{s.val.toLocaleString('vi-VN')}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Placeholder biểu đồ — sẽ thay bằng recharts sau */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">📈 Người dùng mới (7 ngày qua)</div>
          <div className="p-6 h-52 flex items-center justify-center bg-gray-50 text-gray-400 text-sm text-center">
            <div>
              <div className="text-4xl mb-2">📊</div>
              <div>Biểu đồ minh họa</div>
              <div className="text-xs mt-1">Tích hợp recharts để hiển thị dữ liệu thật</div>
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">🕐 Hoạt động gần đây</div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            recentActivity.map((r, i) => (
              <div key={i} className={`px-5 py-3.5 flex items-center gap-3 ${i < recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(r.name ?? r.userName ?? '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{r.name ?? r.userName}</div>
                  <div className="text-xs text-gray-500 truncate">{r.action ?? r.description}</div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{r.time ?? r.createdAt}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}