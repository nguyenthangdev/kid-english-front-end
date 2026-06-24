import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tagSchema } from '@/validations/admin/vocab-tags.validation'
import { useEffect } from 'react'
import { COLORS } from '@/utils'
import { Loader2 } from 'lucide-react'

export function TagsModal({ open, item, onClose, onSave, isSaving }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      colorCode: 'green'
    }
  })

  // Theo dõi khi mở modal: Nếu có item thì nạp data sửa, không thì form trắng
  useEffect(() => {
    if (open) {
      reset({
        name: item?.name || '',
        colorCode: item?.colorCode || 'green'
      })
    }
  }, [open, item, reset])

  // Hàm submit chuẩn của hook-form
  const onSubmit = (data) => {
    // Gọi hàm handleSave ở component cha truyền xuống
    onSave(data) 
  }

  const isProcessing = isSaving || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          
          {/* Ô Input Tên các thẻ */}
          <div>
            <Label htmlFor="name">Tên các thẻ</Label>
            <Input 
              id="name"
              className={`mt-1 ${errors.name ? 'border-red-500 bg-red-50' : ''}`} 
              placeholder="Ví dụ: Động vật, Gia đình..." 
              disabled={isProcessing}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Ô Select Màu Sắc (Bắt buộc dùng Controller) */}
          <div>
            <Label>Màu sắc</Label>
            <Controller
              name="colorCode"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value} 
                  disabled={isProcessing}
                >
                  <SelectTrigger className={`mt-1 ${errors.colorCode ? 'border-red-500 bg-red-50' : ''}`}>
                    <SelectValue placeholder="Chọn màu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map(c => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${c}-500`}></div>
                          {c}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.colorCode && (
              <p className="mt-1.5 text-sm text-red-500">{errors.colorCode.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Hủy
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '💾 '} 
              {isProcessing ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}

