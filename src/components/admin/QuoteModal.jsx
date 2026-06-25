import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema } from '@/validations/admin/quote.validation'

export function QuoteModal({ open, item, tags = [], onClose, onSave, isSaving }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      contentEn: '',
      contentVn: '',
      author: '',
      tagId: '',
    },
  })

  // 3. RESET FORM KHI MỞ HOẶC ĐỔI ITEM
  useEffect(() => {
    if (open) {
      reset({
        contentEn: item?.contentEn || '',
        contentVn: item?.contentVn || '',
        author: item?.author || '',
        tagId: item?.tagId || item?.tag?.id || '',
      })
    }
  }, [item, open, reset])

  const onSubmit = (data) => {
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isSaving && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Chỉnh sửa câu nói' : 'Thêm câu nói mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          
          <div>
            <Label>Câu nói (tiếng Anh) <span className="text-red-500">*</span></Label>
            <textarea 
              {...register('contentEn')}
              className={`mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none focus:border-violet-500 ${errors.contentEn ? 'border-red-500' : 'border-gray-300'}`}
              rows={3} 
              placeholder="Ví dụ: The only way to do great work is to love what you do."
            />
            {errors.contentEn && <p className="text-red-500 text-xs mt-1">{errors.contentEn.message}</p>}
          </div>
          
          <div>
            <Label>Dịch nghĩa (tiếng Việt) <span className="text-red-500">*</span></Label>
            <textarea 
              {...register('contentVn')}
              className={`mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none focus:border-violet-500 ${errors.contentVn ? 'border-red-500' : 'border-gray-300'}`}
              rows={2} 
              placeholder="Cách duy nhất để làm việc tốt là yêu thích những gì bạn làm."
            />
            {errors.contentVn && <p className="text-red-500 text-xs mt-1">{errors.contentVn.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tác giả</Label>
              <Input 
                {...register('author')}
                className={`mt-1 ${errors.author ? 'border-red-500' : ''}`}
                placeholder="Steve Jobs (Tùy chọn)" 
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
            </div>
            
            <div>
              <Label>Thẻ chủ đề <span className="text-red-500">*</span></Label>
              {/* Dùng Controller để kết nối Select của Radix UI với React Hook Form */}
              <Controller
                name="tagId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.tagId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Chọn thẻ..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tagId && <p className="text-red-500 text-xs mt-1">{errors.tagId.message}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Hủy</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '💾 '} 
              {isSaving ? 'Đang lưu...' : ' Lưu lại'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}