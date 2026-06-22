import { Button } from '@/components/ui/button'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <Button key={p} size="sm" variant={page === p ? 'default' : 'outline'} onClick={() => onPageChange(p)} className="w-9">{p}</Button>
      ))}
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</Button>
    </div>
  )
}