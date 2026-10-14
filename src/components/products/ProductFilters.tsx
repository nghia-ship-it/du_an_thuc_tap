import React from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '../common/Button'
import { productCategories, productStatuses } from '../../schemas/productSchema'

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  onResetFilters: () => void
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== '' || selectedStatus !== ''

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-200/80 mb-5">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo tên sản phẩm..."
          className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-2xs"
        />
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-48">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
        >
          <option value="">Tất cả danh mục</option>
          {productCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-44">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
        >
          <option value="">Tất cả trạng thái</option>
          {productStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          leftIcon={<Search className="w-4 h-4" />}
          className="whitespace-nowrap"
        >
          Tìm kiếm
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            size="sm"
            className="text-slate-500 whitespace-nowrap"
          >
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  )
}
