/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { adminVocabApi } from '@/apis/admin'
import { toast } from 'react-toastify'
import { Camera, Loader2 } from 'lucide-react'
import { vocabSchema } from '@/validations/admin/vocab.validation'

export function VocabModal({ open, item, tags, onClose, onSave, isSaving }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(vocabSchema),
    defaultValues: {
      word: '',
      pronunciation: '',
      meaning: '',
      tagId: '',
      imageUrl: item?.imageUrl || ''
      // example: ''
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        word: item?.word || '',
        pronunciation: item?.pronunciation || '',
        meaning: item?.meaning || '',
        tagId: item?.tag?.id || item?.tagId || '',
        imageUrl: item?.imageUrl || ''
        // example: item?.example || ''
      })
      setPreviewUrl(item?.imageUrl || null)
      setSelectedFile(null)
    }
  }, [open, item, reset])
  // Xử lý tạo URL xem trước khi người dùng chọn file
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl) // Dọn RAM
    }
  }
  const onSubmit = async (data) => {
    let finalImageUrl = data.imageUrl

    if (selectedFile) {
      try {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('image', selectedFile)
        
        const uploadRes = await adminVocabApi.uploadImage(formData)
        console.log('uploadRes: ', uploadRes)
        // Map đúng cấu trúc { data: { imageUrl: ... } } mà NestJS trả về
        finalImageUrl = uploadRes?.data?.data?.imageUrl || uploadRes?.data?.imageUrl
        
      } catch (error) {
        toast.error('Lỗi tải ảnh: ' + (error.response.data.message || 'Thử lại sau'))
        setIsUploading(false)
        return 
      } finally {
        setIsUploading(false)
      }
    }
    const payload = { ...data, imageUrl: finalImageUrl }
    if (!payload.imageUrl || payload.imageUrl.trim() === '') {
      delete payload.imageUrl; 
    }
    onSave(payload)
  }
  const isProcessing = isSaving || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          
          {/* Khu vực Tải ảnh */}
          <div className="flex gap-6 items-center">
            <div className="w-28 h-28 shrink-0">
              <Label 
                htmlFor="vocab-image" 
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition-all hover:bg-gray-50 ${previewUrl ? 'border-violet-300' : 'border-gray-300'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium uppercase">Chọn ảnh</span>
                  </div>
                )}
                <Input 
                  id="vocab-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  disabled={isProcessing} 
                />
              </Label>
            </div>
            <div className="flex-1 text-sm text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Ảnh minh họa từ vựng</p>
              <p>Hỗ trợ JPG, PNG. Kích thước tối đa 2MB.</p>
              <p className="text-xs italic text-violet-600">Mẹo: Ảnh đẹp giúp bé ghi nhớ nhanh hơn!</p>
            </div>
          </div>

          {/* Khu vực Nhập text */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="word">Từ (tiếng Anh) <span className="text-red-500">*</span></Label>
              <Input 
                id="word" 
                className={`mt-1 ${errors.word ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                {...register('word')} 
                disabled={isProcessing} 
              />
              {/* Hiển thị lỗi từ tiếng Anh */}
              {errors.word && <p className="mt-1.5 text-sm text-red-500">{errors.word.message}</p>}
            </div>
            <div>
              <Label htmlFor="pronunciation">Phiên âm</Label>
              <Input 
                id="pronunciation" 
                className={`mt-1 ${errors.pronunciation ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                {...register('pronunciation')} 
                disabled={isProcessing} 
              />
              {/* Hiển thị lỗi phiên âm (nếu schema có require) */}
              {errors.pronunciation && <p className="mt-1.5 text-sm text-red-500">{errors.pronunciation.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="meaning">Nghĩa (tiếng Việt) <span className="text-red-500">*</span></Label>
            <Input 
              id="meaning" 
              className={`mt-1 ${errors.meaning ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
              {...register('meaning')} 
              disabled={isProcessing} 
            />
            {/* Hiển thị lỗi nghĩa tiếng Việt */}
            {errors.meaning && <p className="mt-1.5 text-sm text-red-500">{errors.meaning.message}</p>}
          </div>

          <div>
            <Label>Thẻ chủ đề <span className="text-red-500">*</span></Label>
            <Controller
              name="tagId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isProcessing || tags.length === 0}>
                  <SelectTrigger className={`mt-1 ${errors.tagId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Chọn thẻ" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${t.colorCode}-500`}></div>{t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* Hiển thị lỗi chưa chọn thẻ */}
            {errors.tagId && <p className="mt-1.5 text-sm text-red-500">{errors.tagId.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Hủy</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '💾 '}
              {isUploading ? 'Đang tải ảnh...' : 'Lưu lại'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}