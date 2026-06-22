import { useState, useMemo } from 'react'
import { ITEMS_PER_PAGE } from '@/utils/constants'

export function usePagination(items, perPage = ITEMS_PER_PAGE) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(items.length / perPage)

  const paged = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage]
  )

  const reset = () => setPage(1)

  return { page, setPage, totalPages, paged, reset }
}