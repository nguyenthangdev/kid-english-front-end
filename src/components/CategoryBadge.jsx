import { CATEGORY_COLORS, TAG_COLORS } from '@/utils/constants'
import { cn } from '@/utils/cn'

export function CategoryBadge({ value, type = 'category' }) {
  const map = type === 'tag' ? TAG_COLORS : CATEGORY_COLORS
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', map[value] ?? 'bg-gray-100 text-gray-600')}>
      {value}
    </span>
  )
}