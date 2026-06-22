import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MOCK_ROLES, MOCK_RESOURCES, MOCK_ACTIONS } from '@/utils/mockData'

const buildMatrix = () => {
  const m = {}
  MOCK_ROLES.forEach(r => {
    m[r.name] = {}
    MOCK_RESOURCES.forEach(res => {
      m[r.name][res] = {}
      MOCK_ACTIONS.forEach(a => {
        m[r.name][res][a] =
          r.name === 'Super Admin' ? true :
          r.name === 'Content Manager' && ['Từ vựng', 'Câu nói', 'Danh mục'].includes(res) && a !== 'Xóa' ? true :
          r.name === 'Moderator' && a === 'Xem'
      })
    })
  })
  return m
}

export function PermissionsPage() {
  const [matrix, setMatrix] = useState(buildMatrix)

  const toggle = (role, res, action) =>
    setMatrix(m => ({ ...m, [role]: { ...m[role], [res]: { ...m[role][res], [action]: !m[role][res][action] } } }))

  const handleSave = () => {
    // TODO: gọi permissionApi.save(matrix)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma trận phân quyền</h1>
        <Button onClick={handleSave}>💾 Lưu thay đổi</Button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left min-w-[120px]">Tài nguyên</th>
                <th className="px-5 py-3 text-left min-w-[100px]">Hành động</th>
                {MOCK_ROLES.map(r => (
                  <th key={r.id} className="px-5 py-3 text-center min-w-[140px]">
                    <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">{r.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_RESOURCES.map(res =>
                MOCK_ACTIONS.map((action, ai) => (
                  <tr key={`${res}-${action}`} className="border-t border-gray-100 hover:bg-gray-50">
                    {ai === 0 && (
                      <td rowSpan={MOCK_ACTIONS.length} className="px-5 py-3 font-bold text-sm text-gray-800 border-r border-gray-100 bg-gray-50/50 align-middle">{res}</td>
                    )}
                    <td className="px-5 py-2.5 text-sm text-gray-500 border-r border-gray-100">{action}</td>
                    {MOCK_ROLES.map(r => (
                      <td key={r.id} className="px-5 py-2.5 text-center">
                        <input type="checkbox" checked={matrix[r.name]?.[res]?.[action] ?? false} onChange={() => toggle(r.name, res, action)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}