import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAuth } from '@/contexts/admin/AdminAuthContext'

const NAV = [
  { group: 'Học tập', items: [
    { to: '/home',       icon: '🏠', label: 'Trang chủ' },
    { to: '/vocabulary', icon: '📖', label: 'Từ vựng của Bé' },
    { to: '/quotes',     icon: '💬', label: 'Câu nói mỗi ngày' },
    { to: '/game',       icon: '🎮', label: 'Trò chơi học tập' },
  ]},
  { group: 'Phần thưởng', items: [
    { to: '/sticker',     icon: '🎁', label: 'Sticker' },
    { to: '/achievement', icon: '🏆', label: 'Thành tích' },
  ]},
  { group: 'Khác', items: [
    { to: '/parent',  icon: '👨‍👩‍👧', label: 'Góc Phụ Huynh' },
    { to: '/profile', icon: '⚙️',   label: 'Hồ sơ của tôi' },
  ]},
]

export function ClientLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-50">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-xl font-extrabold text-emerald-600">📚 KidEnglish</div>
          <div className="text-xs text-gray-400 mt-0.5">Learning Play Grow</div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(g => (
            <div key={g.group} className="mb-2">
              <div className="px-5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{g.group}</div>
              {g.items.map(item => (
                <button key={item.to} onClick={() => navigate(item.to)}
                  className={cn('w-full flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold border-l-[3px] transition-all',
                    pathname === item.to
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                      : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-800'
                  )}>
                  <span className="text-base">{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">{user?.name ?? 'Admin'}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email ?? 'admin@kidenglish.com'}</div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-gray-600 text-sm" title="Đăng xuất">⏏</button>
        </div>
      </aside>

      <main className="ml-60 flex-1 p-7">
        <Outlet />
      </main>
    </div>
  )
}