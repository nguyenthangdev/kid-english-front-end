import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'
import { toast } from 'react-toastify'
import { Bell, ChevronDown, LogOut, Settings, User, Book, Building, Key, LayoutDashboard, MessageSquareText, ShieldUser, Tag, TagPlus, UserPen, UsersRound } from 'lucide-react'
import { TITLES } from '@/utils'

const NAV = [
  { group: 'Tổng quan', items: [
    { to: '/admin/dashboard',   icon: <LayoutDashboard />, label: 'Tổng quan' },
  ]},
  { group: 'Nội dung', items: [
    { to: '/admin/vocabulary',  icon: <Book />, label: 'Từ vựng của bé' },
    { to: '/admin/quotes',      icon: <MessageSquareText />, label: 'Câu nói mỗi ngày' },
    { to: '/admin/vocab-tags',  icon: <Tag />, label: 'Các thẻ từ vựng' },
    { to: '/admin/quote-tags',  icon: <TagPlus />, label: 'Các thẻ câu nói' },
  ]},
  { group: 'Người dùng', items: [
    { to: '/admin/users',       icon: <UsersRound />, label: 'Người dùng' },
    { to: '/admin/admins',      icon: <ShieldUser />, label: 'Tài khoản Admin' },
  ]},
  { group: 'Phân quyền', items: [
    { to: '/admin/roles',       icon: <Key />, label: 'Nhóm quyền' },
    { to: '/admin/permissions', icon: <Building />, label: 'Ma trận phân quyền' },
  ]},
  { group: 'Tài khoản', items: [
    { to: '/admin/profile',     icon: <UserPen />, label: 'Hồ sơ của tôi' },
    { to: '/admin/settings',    icon: <Settings />, label: 'Cài đặt' },
  ]},
]

export function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { admin, logout } = useAdminAuth()

  const handleLogout = async () => {
    const response = await logout()
    toast.success(response?.message || 'Đăng xuất thành công!')
    navigate('/admin/auth/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-50">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-xl font-extrabold text-violet-600">🛡️ KidEnglish</div>
          <div className="text-xs text-gray-400 mt-0.5">Trang Quản Trị</div>
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
          {admin?.avatarUrl ? (
            <img 
              src={admin.avatarUrl} 
              alt={admin?.name ?? 'Avatar'} 
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {admin?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">{admin?.name ?? 'Super Admin'}</div>
            <div className="text-xs text-gray-400 truncate">{admin?.email ?? 'admin@kidenglish.com'}</div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm" title="Đăng xuất">⏏</button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-gray-800">{TITLES[pathname] ?? 'Admin'}</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700" title="Thông báo">
              <Bell className="h-4 w-4" />
            </button>

            <div className="relative group">
              <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white pl-1 pr-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                {admin?.avatarUrl ? (
                  <img 
                    src={admin.avatarUrl} 
                    alt={admin?.name ?? 'Avatar'} 
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {admin?.name?.[0]?.toUpperCase() ?? 'A'}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              <div className="invisible absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="truncate text-sm font-bold text-gray-800">{admin?.name ?? 'Super Admin'}</div>
                    <div className="truncate text-xs text-gray-400">{admin?.email ?? 'admin@kidenglish.com'}</div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('/admin/profile')}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <User className="h-4 w-4" />
                      Hồ sơ của tôi
                    </button>
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Settings className="h-4 w-4" />
                      Cài đặt
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
