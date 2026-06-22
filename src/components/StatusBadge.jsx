import { cn } from '@/utils/cn'

export function StatusBadge({ active }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
      active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
    )}>
      {active ? 'Hoạt động' : 'Tạm khóa'}
    </span>
  )
}