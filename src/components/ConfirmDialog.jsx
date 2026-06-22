import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Xác nhận xóa', description = 'Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.' }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <p className="text-sm text-gray-500">{description}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="destructive" onClick={onConfirm}>Xóa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}