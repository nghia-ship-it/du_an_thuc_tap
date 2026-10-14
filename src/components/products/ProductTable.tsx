import React, { useState, useMemo } from 'react'
import {
  FileSpreadsheet,
  Edit2,
  Trash2,
  PackageOpen,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Pagination } from '../common/Pagination'
import { ProductFilters } from './ProductFilters'
import { ProductEditModal } from './ProductEditModal'
import { ProductDeleteModal } from './ProductDeleteModal'
import { usePagination } from '../../hooks/usePagination'
import { useDebounce } from '../../hooks/useDebounce'
import { formatVND, formatDate, exportToCSV } from '../../utils/formatters'
import type { Product } from '../../types/product'

interface ProductTableProps {
  products: Product[]
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (id: string) => void
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Debounce search term for smooth searching
  const debouncedSearchTerm = useDebounce(searchTerm, 250)

  // Sort state
  const [sortField, setSortField] = useState<keyof Product>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesName = p.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase().trim())
        const matchesCategory =
          selectedCategory === '' || p.category === selectedCategory
        const matchesStatus =
          selectedStatus === '' || p.status === selectedStatus
        return matchesName && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        const valA = a[sortField]
        const valB = b[sortField]
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })
  }, [products, debouncedSearchTerm, selectedCategory, selectedStatus, sortField, sortOrder])

  // Custom Pagination hook
  const {
    currentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePagination<Product>({
    items: filteredProducts,
    initialPage: 1,
    initialPageSize: 5,
  })

  // Export to CSV/Excel
  const handleExportExcel = () => {
    const exportData = filteredProducts.map((p, index) => ({
      STT: index + 1,
      'Mã sản phẩm': p.id,
      'Tên sản phẩm': p.name,
      'Danh mục': p.category,
      'Giá (VNĐ)': p.price,
      'Số lượng': p.quantity,
      'Trạng thái': p.status,
      'Ngày tạo': formatDate(p.createdAt),
      'Mô tả': p.description || '',
    }))
    exportToCSV(`danh_sach_san_pham_${new Date().toISOString().slice(0, 10)}`, exportData)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('')
  }

  const toggleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <Card className="border border-slate-200 shadow-xs">
      <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">
            Danh sách sản phẩm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng số{' '}
            <span className="font-semibold text-blue-600">{products.length}</span>{' '}
            sản phẩm trong hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
          className="text-xs font-semibold shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
        >
          Xuất Excel
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onResetFilters={handleResetFilters}
        />

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-20">Hình ảnh</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tên sản phẩm</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Giá (VNĐ)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => toggleSort('quantity')}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Số lượng</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Ngày tạo</th>
                <th className="py-3.5 px-4 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((product, idx) => {
                  const absoluteIndex = (currentPage - 1) * pageSize + idx + 1
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center text-xs font-medium text-slate-500">
                        {absoluteIndex}
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                // fallback image if url fails
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=150&auto=format&fit=crop&q=80'
                              }}
                            />
                          ) : (
                            <PackageOpen className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Name & Description */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                            {product.description}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 text-sm whitespace-nowrap">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {formatVND(product.price)}
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                        {product.quantity}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Badge status={product.status} />
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-center text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageOpen className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        Không tìm thấy sản phẩm nào
                      </p>
                      <p className="text-xs text-slate-400">
                        Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
        />
      </CardContent>

      {/* Edit Modal */}
      <ProductEditModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onUpdateProduct={onUpdateProduct}
      />

      {/* Delete Modal */}
      <ProductDeleteModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onConfirmDelete={onDeleteProduct}
      />
    </Card>
  )
}
