import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAdminAuth } from '@/contexts/AuthContext'

const NAV = [
  { group: 'Tổng quan', items: [
    { to: '/admin/dashboard',   icon: '📊', label: 'Dashboard' },
  ]},
  { group: 'Nội dung', items: [
    { to: '/admin/vocabulary',  icon: '📖', label: 'Từ vựng của bé' },
    { to: '/admin/quotes',      icon: '💬', label: 'Câu nói mỗi ngày' },
    { to: '/admin/vocab-tags',  icon: '🏷️', label: 'Các thẻ từ vựng' },
    { to: '/admin/quote-tags',  icon: '🏷️', label: 'Các thẻ câu nói' },
  ]},
  { group: 'Người dùng', items: [
    { to: '/admin/users',       icon: '👥', label: 'Người dùng' },
    { to: '/admin/admins',      icon: '🛡️', label: 'Tài khoản Admin' },
  ]},
  { group: 'Phân quyền', items: [
    { to: '/admin/roles',       icon: '🔑', label: 'Nhóm quyền' },
    { to: '/admin/permissions', icon: '📋', label: 'Ma trận phân quyền' },
  ]},
  { group: 'Tài khoản', items: [
    { to: '/admin/profile',     icon: '👤', label: 'Hồ sơ của tôi' },
  ]},
]

const TITLES = {
  '/admin/dashboard':   '📊 Dashboard',
  '/admin/vocabulary':  '📖 Từ vựng của bé',
  '/admin/quotes':      '💬 Câu nói mỗi ngày',
  '/admin/categories':  '🏷️ Danh mục từ vựng',
  '/admin/admins':      '🛡️ Tài khoản Admin',
  '/admin/users':       '👥 Người dùng',
  '/admin/roles':       '🔑 Nhóm quyền',
  '/admin/permissions': '📋 Ma trận phân quyền',
  '/admin/profile':     '👤 Hồ sơ của tôi',
}

export function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { admin, logout } = useAdminAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-50">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-xl font-extrabold text-violet-600">🛡️ KidEnglish</div>
          <div className="text-xs text-gray-400 mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(g => (
            <div key={g.group} className="mb-2">
              <div className="px-5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{g.group}</div>
              {g.items.map(item => (
                <button key={item.to} onClick={() => navigate(item.to)}
                  className={cn('w-full flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold border-l-[3px] transition-all',
                    pathname === item.to
                      ? 'bg-violet-50 text-violet-700 border-violet-500'
                      : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-800'
                  )}>
                  <span className="text-base">{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {admin?.name?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">{admin?.name ?? 'Super Admin'}</div>
            <div className="text-xs text-gray-400 truncate">{admin?.email ?? 'admin@kidenglish.com'}</div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-gray-600 text-sm" title="Đăng xuất">⏏</button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-gray-800">{TITLES[pathname] ?? 'Admin'}</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">🔔</button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer">A</div>
          </div>
        </header>
        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}