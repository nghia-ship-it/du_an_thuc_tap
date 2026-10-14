import React from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import type { Product } from '../../types/product'

interface ProductDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onConfirmDelete: (id: string) => void
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirmDelete,
}) => {
  if (!product) return null

  const handleDelete = () => {
    onConfirmDelete(product.id)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận xóa sản phẩm" maxWidth="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <p className="text-sm text-slate-700">
          Bạn có chắc chắn muốn xóa sản phẩm{' '}
          <span className="font-semibold text-slate-900">"{product.name}"</span> không?
        </p>
        <p className="text-xs text-slate-500 mt-1.5">
          Hành động này sẽ xóa dữ liệu sản phẩm khỏi danh sách và không thể hoàn tác.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6 w-full">
          <Button type="button" variant="outline" onClick={onClose} className="w-1/2">
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="w-1/2"
          >
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}
