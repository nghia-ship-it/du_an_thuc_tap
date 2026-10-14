import { z } from 'zod'

export const productCategories = [
  'Điện thoại',
  'Laptop',
  'Phụ kiện',
  'Máy tính bảng',
  'Đồng hồ',
  'Thiết bị thông minh',
  'Khác',
] as const

export const productStatuses = ['Còn hàng', 'Sắp hết', 'Hết hàng'] as const

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm không được để trống')
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(100, 'Tên sản phẩm không được vượt quá 100 ký tự'),
  category: z.enum(productCategories, {
    errorMap: () => ({ message: 'Vui lòng chọn danh mục hợp lệ' }),
  }),
  price: z.coerce
    .number({ invalid_type_error: 'Giá sản phẩm phải là một số hợp lệ' })
    .min(1000, 'Giá sản phẩm tối thiểu phải từ 1,000 ₫ trở lên'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Số lượng phải là một số nguyên hợp lệ' })
    .int('Số lượng phải là số nguyên')
    .min(0, 'Số lượng không được âm'),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional(),
  imageUrl: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
