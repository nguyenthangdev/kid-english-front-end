import { CATEGORY_COLORS, COLOR_VARIANTS, TAG_COLORS } from '@/utils/constants'
import { cn } from '@/utils/cn'

export function CategoryBadge({ value, color, type = 'category' }) {
  if (color && COLOR_VARIANTS[color]) {
    return (
      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', COLOR_VARIANTS[color])}>
        {value}
      </span>
    )
  }
  const map = type === 'tag' ? TAG_COLORS : CATEGORY_COLORS
  const finalClass = map[value] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', finalClass)}>
      {value}
    </span>
  )
}