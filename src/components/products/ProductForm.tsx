import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, RotateCcw, Image as ImageIcon } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../common/Card'
import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { Button } from '../common/Button'
import {
  productFormSchema,
  productCategories,
  type ProductFormValues,
} from '../../schemas/productSchema'
import type { Product, ProductCategory, ProductStatus } from '../../types/product'

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void
}

export const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [imagePreview, setImagePreview] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      category: undefined,
      price: undefined,
      quantity: undefined,
      description: '',
      imageUrl: '',
    },
  })

  // Handle local image file upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: ProductFormValues) => {
    // Automatically derive status from quantity
    let status: ProductStatus = 'Còn hàng'
    if (data.quantity === 0) {
      status = 'Hết hàng'
    } else if (data.quantity <= 5) {
      status = 'Sắp hết'
    }

    const defaultImage =
      imagePreview ||
      data.imageUrl ||
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=150&auto=format&fit=crop&q=80'

    onAddProduct({
      name: data.name.trim(),
      category: data.category as ProductCategory,
      price: Number(data.price),
      quantity: Number(data.quantity),
      status,
      description: data.description?.trim(),
      imageUrl: defaultImage,
    })

    reset()
    setImagePreview('')
  }

  const handleReset = () => {
    reset()
    setImagePreview('')
  }

  return (
    <Card className="border border-slate-200 shadow-xs mb-8">
      <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 m-0">
              Thêm sản phẩm mới
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Điền đầy đủ thông tin để thêm sản phẩm vào hệ thống
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tên sản phẩm */}
            <Input
              label="Tên sản phẩm"
              required
              placeholder="Nhập tên sản phẩm"
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Danh mục */}
            <Select
              label="Danh mục"
              required
              placeholder="Chọn danh mục"
              options={productCategories}
              error={errors.category?.message}
              {...register('category')}
            />

            {/* Giá sản phẩm */}
            <Input
              label="Giá (VNĐ)"
              required
              type="number"
              placeholder="Nhập giá sản phẩm"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Số lượng */}
            <Input
              label="Số lượng"
              required
              type="number"
              placeholder="Nhập số lượng"
              error={errors.quantity?.message}
              {...register('quantity')}
            />

            {/* Mô tả */}
            <div className="w-full flex flex-col gap-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-700">
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none hover:border-slate-400"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Hình ảnh */}
            <div className="w-full flex flex-col gap-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-700">
                Hình ảnh
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>Chọn file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500 truncate max-w-[150px]">
                  {imagePreview ? 'Đã chọn 1 ảnh' : 'Chưa có file nào được chọn'}
                </span>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-8 h-8 rounded-md object-cover border border-slate-200 shadow-2xs"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Thêm sản phẩm
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Làm mới
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
