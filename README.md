# Báo Cáo Thực Tập React Developer — Giai Đoạn 2

Dự án thực hành chuyên sâu theo kế hoạch đào tạo React Developer (Tuần 4 – Tuần 7).

---

## 📌 Tổng Quan Giai Đoạn 2

| Tuần | Chủ Đề Thực Hành | Trạng Thái |
| :--- | :--- | :--- |
| **Tuần 4** | **Component & CRUD Cơ Bản (Local State, RHF, Zod, Custom Hooks)** | ✅ **Đã hoàn thành 100%** |
| **Tuần 5** | Router & Kết nối API thực tế (Axios, Generics, .env, 3 trạng thái Loading/Error/Empty) | ⏳ Sẵn sàng nâng cấp |
| **Tuần 6** | Authentication, TanStack Query & Kiến trúc Feature-based, Git Hooks | ⏳ Sẵn sàng nâng cấp |
| **Tuần 7** | Tối ưu Performance, Vitest Unit Test, Docker & Deploy Vercel | ⏳ Sẵn sàng nâng cấp |

---

## 🚀 Chi Tiết Sản Phẩm Tuần 4

### 1. Giao Diện & Tính Năng (100% Khớp Thiết Kế Mẫu)
- **Thêm sản phẩm mới (`ProductForm`):**
  - Validation chặt chẽ bằng **React Hook Form + Zod**.
  - Bắt lỗi theo từng field (Tên sản phẩm >= 3 ký tự, Giá >= 1,000 VND, Số lượng >= 0, Danh mục bắt buộc).
  - Tự động suy ra trạng thái: `Còn hàng` (> 5), `Sắp hết` (1 - 5), `Hết hàng` (0).
  - Hỗ trợ chọn/preview hình ảnh sản phẩm.
  - Nút **Làm mới** (Reset form) và **Thêm sản phẩm**.
- **Danh sách sản phẩm (`ProductTable`):**
  - Hiển thị bảng dữ liệu chuyên nghiệp với hình ảnh thumbnail, danh mục, giá tiền định dạng VND (`xx.xxx.xxx ₫`), số lượng, huy hiệu trạng thái (Badge màu xanh/cam/đỏ), ngày tạo.
  - Sắp xếp (Sort) linh hoạt theo tên, giá, số lượng.
  - Nút **Xuất Excel** (tải về file `.csv` chuẩn font tiếng Việt có dấu).
- **Bộ lọc & Tìm kiếm (`ProductFilters`):**
  - Tìm kiếm theo tên sản phẩm có tích hợp **Debounce (250ms)** giúp gõ mượt mà.
  - Lọc theo danh mục: Điện thoại, Laptop, Phụ kiện, Máy tính bảng, Đồng hồ, v.v.
  - Lọc theo trạng thái: Còn hàng, Sắp hết, Hết hàng.
  - Nút Reset bộ lọc nhanh.
- **Phân trang (`Pagination`):**
  - Tùy chọn hiển thị `5`, `10`, `20`, `50` bản ghi/trang.
  - Nút điều hướng `< Trang trước`, `1`, `2`, `...`, `Trang kế >`.
- **Hệ thống Modal:**
  - `ProductEditModal`: Mở modal chỉnh sửa dữ liệu được nạp sẵn thông tin cũ, validate lại bằng Zod.
  - `ProductDeleteModal`: Modal xác nhận trước khi xóa tránh thao tác nhầm lẫn.
- **Hệ thống Toast Notification:**
  - Báo thành công khi thêm/sửa, cảnh báo khi xóa sản phẩm.
- **Ứng dụng phụ To-do List (`TodoListApp`):**
  - Tích hợp thêm tab To-do List theo hình minh họa phụ của tuần 4.

---

### 2. Cấu Trúc Mã Nguồn Chuẩn Doanh Nghiệp
```
src/
├── components/
│   ├── common/              # Các UI Component dùng chung (Design System)
│   │   ├── Badge.tsx        # Huy hiệu trạng thái Còn hàng / Sắp hết / Hết hàng
│   │   ├── Button.tsx       # Button đa biến thể (primary, outline, danger, ghost...)
│   │   ├── Card.tsx         # Card container
│   │   ├── Input.tsx        # Input tích hợp forwardRef cho RHF & báo lỗi
│   │   ├── Select.tsx       # Select dropdown tùy biến
│   │   ├── Modal.tsx        # Modal accessibility (backdrop, ESC key)
│   │   ├── Pagination.tsx   # Phân trang chuẩn
│   │   └── Toast.tsx        # Thông báo trạng thái
│   ├── products/            # Các component chuyên biệt cho sản phẩm
│   │   ├── ProductForm.tsx
│   │   ├── ProductTable.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductEditModal.tsx
│   │   └── ProductDeleteModal.tsx
│   └── todos/               # Module To-Do List minh họa
│       └── TodoListApp.tsx
├── hooks/                   # Custom Hooks tái sử dụng
│   ├── useDebounce.ts       # Debounce tìm kiếm
│   ├── useLocalStorage.ts   # Lưu trữ và đồng bộ dữ liệu vào LocalStorage
│   └── usePagination.ts     # Xử lý tính toán phân trang
├── schemas/
│   └── productSchema.ts     # Zod schema validation
├── types/
│   └── product.ts           # TypeScript interfaces & types
├── utils/
│   ├── cn.ts                # Merge tailwind classes
│   └── formatters.ts        # Format tiền tệ VND, ngày tháng, xuất CSV
├── App.tsx                  # Dashboard chính kết hợp KPI cards & tabs
└── main.tsx
```

---

### 3. Hướng Dẫn Chạy Dự Án

```bash
# Cài đặt thư viện (nếu clone máy mới)
npm install

# Khởi chạy môi trường phát triển (Development)
npm run dev

# Kiểm tra build Production
npm run build
```
