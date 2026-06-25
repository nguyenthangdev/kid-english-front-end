import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roleSchema } from '@/validations/admin/role.validation'

export function RoleModal({ open, item, onClose, onSave, isSaving }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: item?.name || '',
        code: item?.code || '',
        description: item?.description || '',
      })
    }
  }, [item, open, reset])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isSaving && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 py-2">
          <div>
            <Label>Tên nhóm quyền <span className="text-red-500">*</span></Label>
            <Input 
              {...register('name')}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="VD: Quản trị viên" 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Mã hệ thống (Code) <span className="text-red-500">*</span></Label>
            <Input 
              {...register('code')}
              disabled={!!item?.id} // Thường Code không cho phép sửa sau khi tạo
              className={`mt-1 font-mono ${errors.code ? 'border-red-500' : ''}`}
              placeholder="VD: ADMIN, TEACHER" 
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>
          
          <div>
            <Label>Mô tả</Label>
            <textarea 
              {...register('description')}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 resize-none"
              rows={3} 
              placeholder="Nhập mô tả về nhóm quyền này..."
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Hủy</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '💾 '} Lưu lại
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}