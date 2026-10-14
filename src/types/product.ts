export type ProductCategory =
  | 'Điện thoại'
  | 'Laptop'
  | 'Phụ kiện'
  | 'Máy tính bảng'
  | 'Đồng hồ'
  | 'Thiết bị thông minh'
  | 'Khác'

export type ProductStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  quantity: number
  status: ProductStatus
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface ProductFilterParams {
  searchTerm: string
  category: string
  status: string
}
