import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { Button } from '../common/Button'
import {
  productFormSchema,
  productCategories,
  type ProductFormValues,
} from '../../schemas/productSchema'
import type { Product, ProductCategory, ProductStatus } from '../../types/product'

interface ProductEditModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onUpdateProduct: (updated: Product) => void
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      })
    }
  }, [product, reset])

  if (!product) return null

  const onSubmit = (data: ProductFormValues) => {
    let status: ProductStatus = 'Còn hàng'
    if (data.quantity === 0) {
      status = 'Hết hàng'
    } else if (data.quantity <= 5) {
      status = 'Sắp hết'
    }

    const updatedProduct: Product = {
      ...product,
      name: data.name.trim(),
      category: data.category as ProductCategory,
      price: Number(data.price),
      quantity: Number(data.quantity),
      status,
      description: data.description?.trim(),
      updatedAt: new Date().toISOString(),
    }

    onUpdateProduct(updatedProduct)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa sản phẩm"
      subtitle={`Cập nhật thông tin cho "${product.name}"`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Tên sản phẩm"
          required
          placeholder="Nhập tên sản phẩm"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Danh mục"
            required
            options={productCategories}
            error={errors.category?.message}
            {...register('category')}
          />

          <Input
            label="Giá (VNĐ)"
            required
            type="number"
            placeholder="Nhập giá"
            error={errors.price?.message}
            {...register('price')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số lượng"
            required
            type="number"
            placeholder="Nhập số lượng"
            error={errors.quantity?.message}
            {...register('quantity')}
          />

          <Input
            label="Đường dẫn ảnh (URL)"
            placeholder="https://..."
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Mô tả sản phẩm</label>
          <textarea
            rows={3}
            placeholder="Nhập mô tả"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none hover:border-slate-400"
            {...register('description')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  )
}
