import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { permissionApi } from '@/apis/admin'
import { useRoles } from '@/contexts/admin/RoleContext'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

// -- MOCK DATA CŨ (giữ lại để rollback nhanh nếu cần) --
// import { MOCK_ROLES, MOCK_RESOURCES, MOCK_ACTIONS } from '@/utils/mockData'
// const buildMatrix = () => { ... }

// Danh sách resources & actions — sẽ được override bởi data từ API nếu có
const DEFAULT_RESOURCES = ['Từ vựng', 'Câu nói', 'Thẻ', 'Admin', 'Người dùng', 'Nhóm quyền', 'Phân quyền']
const DEFAULT_ACTIONS   = ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa']

// Khởi tạo matrix rỗng từ roles × resources × actions
const buildEmptyMatrix = (roles, resources, actions) => {
  const m = {}
  roles.forEach(r => {
    m[r.name] = {}
    resources.forEach(res => {
      m[r.name][res] = {}
      actions.forEach(a => { m[r.name][res][a] = false })
    })
  })
  return m
}

export function PermissionsPage() {
  const { state: { roles }, fetchRoles } = useRoles()

  const [matrix,     setMatrix]     = useState({})
  const [resources,  setResources]  = useState(DEFAULT_RESOURCES)
  const [actions,    setActions]    = useState(DEFAULT_ACTIONS)
  const [isLoading,  setIsLoading]  = useState(true)
  const [isSaving,   setIsSaving]   = useState(false)

  // Fetch matrix từ server, nếu fail thì dùng fallback rỗng
  const fetchMatrix = useCallback(async (currentRoles) => {
    try {
      setIsLoading(true)
      const response = await permissionApi.getMatrix()

      if (response?.matrix) {
        // Backend trả về matrix object
        setMatrix(response.matrix)
        if (response.resources) setResources(response.resources)
        if (response.actions)   setActions(response.actions)
      } else if (currentRoles.length > 0) {
        // Fallback: build empty matrix từ roles hiện có
        setMatrix(buildEmptyMatrix(currentRoles, DEFAULT_RESOURCES, DEFAULT_ACTIONS))
      }
    } catch {
      // Nếu API chưa sẵn sàng, dùng empty matrix để không crash
      if (currentRoles.length > 0) {
        setMatrix(buildEmptyMatrix(currentRoles, DEFAULT_RESOURCES, DEFAULT_ACTIONS))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  // Khi roles load xong, fetch matrix
  useEffect(() => {
    if (roles && roles.length > 0) {
      fetchMatrix(roles)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles.length])

  const toggle = (role, res, action) =>
    setMatrix(m => ({
      ...m,
      [role]: { ...m[role], [res]: { ...m[role]?.[res], [action]: !m[role]?.[res]?.[action] } }
    }))

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await permissionApi.save({ matrix, resources, actions })
      toast.success('Lưu phân quyền thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu phân quyền!')
    } finally {
      setIsSaving(false)
    }
  }

  // Roles dùng để render cột — ưu tiên roles từ context (API thật)
  const displayRoles = roles.length > 0 ? roles : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma trận phân quyền</h1>
        <Button onClick={handleSave} disabled={isSaving || isLoading} className="min-w-[140px]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isSaving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[200px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left min-w-[120px]">Tài nguyên</th>
                <th className="px-5 py-3 text-left min-w-[100px]">Hành động</th>
                {displayRoles.map(r => (
                  <th key={r.id} className="px-5 py-3 text-center min-w-[140px]">
                    <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
                      {r.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map(res =>
                actions.map((action, ai) => (
                  <tr key={`${res}-${action}`} className="border-t border-gray-100 hover:bg-gray-50">
                    {ai === 0 && (
                      <td rowSpan={actions.length} className="px-5 py-3 font-bold text-sm text-gray-800 border-r border-gray-100 bg-gray-50/50 align-middle">
                        {res}
                      </td>
                    )}
                    <td className="px-5 py-2.5 text-sm text-gray-500 border-r border-gray-100">{action}</td>
                    {displayRoles.map(r => (
                      <td key={r.id} className="px-5 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={matrix[r.name]?.[res]?.[action] ?? false}
                          onChange={() => toggle(r.name, res, action)}
                          className="w-4 h-4 accent-emerald-500 cursor-pointer"
                          disabled={isLoading}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {displayRoles.length === 0 && !isLoading && (
            <div className="py-10 text-center text-gray-400 text-sm">
              Chưa có nhóm quyền nào. Hãy tạo Role trước.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}