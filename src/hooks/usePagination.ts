import { useState, useMemo, useEffect } from 'react'

export interface UsePaginationOptions<T> {
  items: T[]
  initialPage?: number
  initialPageSize?: number
}

export function usePagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 5,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Auto adjust currentPage if items change or page size changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [items, currentPage, pageSize])

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(p)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const canNextPage = currentPage < totalPages
  const canPrevPage = currentPage > 1

  return {
    currentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  }
}
