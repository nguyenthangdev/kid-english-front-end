/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRoles } from '@/contexts/admin/RoleContext'
import { adminPermissionApi } from '@/apis/admin'
import { ACTION_NAMES, MODULE_NAMES } from '@/utils'

export function PermissionsPage() {
  const { state: { roles, isLoading: rolesLoading }, fetchRoles } = useRoles()
  const [permissions, setPermissions] = useState([])
  const [matrix, setMatrix] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingPerms, setIsLoadingPerms] = useState(true)

  useEffect(() => {
    fetchRoles(true) 
    adminPermissionApi.getAll()
      .then(res => setPermissions(res.data || res))
      .catch(() => toast.error('Lỗi tải danh sách quyền'))
      .finally(() => setIsLoadingPerms(false))
  }, [fetchRoles])
  console.log('role: ', roles)
  useEffect(() => {
    if (roles.length > 0 && permissions.length > 0) {
      const initMatrix = {}
      roles.forEach(role => {
        initMatrix[role.id] = {}
        // Lấy danh sách mã quyền hiện tại của Role này
        const currentPermCodes = role.permissions?.map(p => p.code) || []
        
        permissions.forEach(p => {
          // Bật true nếu Role đã có quyền này
          initMatrix[role.id][p.code] = currentPermCodes.includes(p.code)
        })
      })
      setMatrix(initMatrix)
    }
  }, [roles, permissions])

  const groupedPermissions = useMemo(() => {
    const groups = {}
    permissions.forEach(p => {
      if (!groups[p.module]) groups[p.module] = []
      groups[p.module].push(p)
    })
    return groups
  }, [permissions])

  console.log('groupedPermissions: ', groupedPermissions)
  const toggle = (roleId, permCode) => {
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permCode]: !prev[roleId][permCode]
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {}
      
      roles.forEach(role => {
        if (role.code !== 'ADMIN' && matrix[role.id]) {
          payload[role.id] = {
            // Lọc ra các mã quyền được tick true
            permissions: Object.keys(matrix[role.id]).filter(code => matrix[role.id][code]),
            version: role.version 
          }
        }
      })
      console.log('matrix: ', matrix)
      await adminPermissionApi.saveMatrix({ matrix: payload })
      toast.success('Lưu thay đổi ma trận phân quyền thành công!')
      
      fetchRoles(true) 
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Lỗi khi lưu phân quyền!')
      console.log('Lỗi khi lưu phân quyền!', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (rolesLoading || isLoadingPerms) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-violet-500 w-8 h-8" /></div>
  }

  // Roles dùng để render cột — ưu tiên roles từ context (API thật)
  const displayRoles = roles.length > 0 ? roles : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma trận phân quyền</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '💾 '} 
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left min-w-[150px]">Chức năng (Module)</th>
                <th className="px-5 py-3 text-left min-w-[120px]">Hành động</th>
                {roles.map(r => (
                  <th key={r.id} className="px-5 py-3 text-center min-w-[140px]">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.code === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-violet-100 text-violet-700'}`}>
                      {r.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                perms.map((p, index) => (
                  <tr key={p.code} className="border-t border-gray-100 hover:bg-gray-50">
                    
                    {/* Gom cột Module bằng rowSpan */}
                    {index === 0 && (
                      <td rowSpan={perms.length} className="px-5 py-3 font-bold text-sm text-gray-800 border-r border-gray-100 bg-gray-50/50 align-middle">
                        {MODULE_NAMES[module] || module}
                      </td>
                    )}

                    <td className="px-5 py-2.5 text-sm font-semibold text-gray-600 border-r border-gray-100">
                      {ACTION_NAMES[p.action] || p.action}
                      <div className="text-[10px] text-gray-400 font-normal">{p.description}</div>
                    </td>

                    {/* Vòng lặp in Checkbox cho từng Role */}
                    {roles.map(r => (
                      <td key={r.id} className="px-5 py-2.5 text-center">
                        <input 
                          type="checkbox" 
                          checked={matrix[r.id]?.[p.code] || false} 
                          onChange={() => toggle(r.id, p.code)}
                          disabled={r.code === 'ADMIN'} // ADMIN luôn full quyền, cấm sửa
                          className={`w-4 h-4 cursor-pointer ${r.code === 'ADMIN' ? 'accent-red-500 opacity-50' : 'accent-emerald-500'}`} 
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>

          {displayRoles.length === 0 && !rolesLoading && (
            <div className="py-10 text-center text-gray-400 text-sm">
              Chưa có nhóm quyền nào. Hãy tạo Role trước.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}