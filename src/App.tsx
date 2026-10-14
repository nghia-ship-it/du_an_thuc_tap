import { useState, useId } from 'react'
import {
  Package,
  Layers,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Coins,
  ChevronRight,
  Home,
  Sparkles,
} from 'lucide-react'
import { ProductForm } from './components/products/ProductForm'
import { ProductTable } from './components/products/ProductTable'
import { TodoListApp } from './components/todos/TodoListApp'
import { ToastContainer, type ToastMessage } from './components/common/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialProducts } from './data/initialProducts'
import { formatVND } from './utils/formatters'
import type { Product } from './types/product'

export function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'todos'>('products')
  const [products, setProducts] = useLocalStorage<Product[]>(
    'react_internship_products_v1',
    initialProducts
  )
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const baseId = useId()

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${baseId}-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // CRUD Handlers
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [newProduct, ...prev])
    showToast(`Đã thêm sản phẩm "${newProduct.name}" vào danh sách!`, 'success')
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
    showToast(`Đã cập nhật thông tin sản phẩm "${updatedProduct.name}"!`, 'info')
  }

  const handleDeleteProduct = (id: string) => {
    const deleted = products.find((p) => p.id === id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    showToast(
      deleted ? `Đã xóa sản phẩm "${deleted.name}"!` : 'Đã xóa sản phẩm thành công!',
      'error'
    )
  }

  // Metric stats
  const totalProducts = products.length
  const inStockCount = products.filter((p) => p.status === 'Còn hàng').length
  const lowStockCount = products.filter((p) => p.status === 'Sắp hết').length
  const outOfStockCount = products.filter((p) => p.status === 'Hết hàng').length
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Internship Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 m-0">
                  Quản lý sản phẩm
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Tuần 4
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0 hidden sm:block">
                Thực hành Component & CRUD cơ bản (Local State, RHF, Zod)
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quản lý sản phẩm</span>
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'todos'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>To-do List</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb matching mockup */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800">
              {activeTab === 'products' ? 'Sản phẩm' : 'To-do List'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Trạng thái:</span>
            <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Local State Sync (Ready for Week 5 API)
            </span>
          </div>
        </div>

        {activeTab === 'products' ? (
          <>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Tổng sản phẩm</p>
                  <p className="text-lg font-bold text-slate-900">{totalProducts}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Còn hàng</p>
                  <p className="text-lg font-bold text-emerald-600">{inStockCount}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Sắp hết</p>
                  <p className="text-lg font-bold text-amber-600">{lowStockCount}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Hết hàng</p>
                  <p className="text-lg font-bold text-rose-600">{outOfStockCount}</p>
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Tổng giá trị</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {formatVND(totalInventoryValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Product Form (Thêm sản phẩm mới) */}
            <ProductForm onAddProduct={handleAddProduct} />

            {/* Section 2: Product Table (Danh sách sản phẩm + Search + Filter + Pagination) */}
            <ProductTable
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </>
        ) : (
          <TodoListApp />
        )}
      </main>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Báo cáo Thực tập React Developer — Tuần 4: Dựng UI, Form Validation (Zod), Custom Hooks & Local State CRUD
        </p>
      </footer>
    </div>
  )
}

export default App
