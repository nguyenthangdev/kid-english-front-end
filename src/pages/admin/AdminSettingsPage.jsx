import { useState } from 'react'
import { Bell, Moon, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminSettingsPage() {
  const [emailNotify, setEmailNotify] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-extrabold text-gray-800">Tùy chọn quản trị</h2>
        </div>

        <div className="divide-y divide-gray-100">
          <label className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-gray-800">Thông báo email</div>
                <div className="text-xs text-gray-400">Nhận thông tin quan trọng từ hệ thống</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={(event) => setEmailNotify(event.target.checked)}
              className="h-4 w-4 accent-violet-600"
            />
          </label>

          <label className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Moon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-gray-800">Chế độ gọn</div>
                <div className="text-xs text-gray-400">Giảm khoảng cách trong giao diện quản trị</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) => setCompactMode(event.target.checked)}
              className="h-4 w-4 accent-violet-600"
            />
          </label>

          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-gray-800">Phiên đăng nhập</div>
                <div className="text-xs text-gray-400">Cookie bảo mật đang được dùng cho tài khoản admin</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Kiểm tra</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
