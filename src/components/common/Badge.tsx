import React from 'react'
import { cn } from '../../utils/cn'
import type { ProductStatus } from '../../types/product'

interface BadgeProps {
  status: ProductStatus | string
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200'

  if (status === 'Còn hàng') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20'
  } else if (status === 'Sắp hết') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/20'
  } else if (status === 'Hết hàng') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/20'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colorClasses,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'Còn hàng' && 'bg-emerald-500',
          status === 'Sắp hết' && 'bg-amber-500',
          status === 'Hết hàng' && 'bg-rose-500',
          status !== 'Còn hàng' && status !== 'Sắp hết' && status !== 'Hết hàng' && 'bg-slate-400'
        )}
      />
      {status}
    </span>
  )
}
