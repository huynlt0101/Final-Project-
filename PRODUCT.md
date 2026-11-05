# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Chủ shop duy nhất của Foxie Shop — vận hành shop thời trang một mình, thao tác lặp lại hằng ngày (thêm sản phẩm, kiểm tra đơn hàng, theo dõi số liệu) trong những khoảng thời gian ngắn.

## Product Purpose

Admin panel cho Foxie Shop: quản lý sản phẩm (thêm/list), đơn hàng, và nắm tổng quan kinh doanh. Thành công = quản lý nhanh, ít thao tác — mọi việc cần làm được trong vài click.

## Positioning

Bảng điều khiển nội bộ gọn nhẹ cho shop thời trang thời gian thực: sản phẩm + đơn hàng + doanh thu tập trung một chỗ, không thừa bước.

## Operating Context

- Đăng nhập bằng email/password (`/api/user/admin`), giữ token trong phiên.
- workflows chính: Add Items, List Items, Orders, Dashboard (tổng quan).
- Backend REST tại `VITE_BACKEND_URL` (localhost:8080); dữ liệu sản phẩm có category Men/Women/Kids, bestseller; đơn hàng có trạng thái (Order Placed → Packing → Shipped/Delivered), thanh toán PayPal.
- Font Outfit nạp từ Google Fonts; UI dùng React + Vite + Tailwind v4.

## Capabilities and Constraints

- Chức năng đã có: CRUD sản phẩm, list đơn hàng + cập nhật trạng thái, Dashboard thống kê (sản phẩm, đơn, doanh thu paid, bestseller, category bar, recent orders).
- Đơn hàng/danh sách yêu cầu token; chưa login thì ẩn số liệu.
- Chỉ một role admin (không phân quyền nhiều cấp).
- Chưa quyết định: pagination, export dữ liệu, đa ngôn ngữ.

## Brand Commitments

- Tên: Foxie Shop (admin title "Foxie Admin").
- Tông trắng đen (monochrome) cho admin UI — ràng buộc user xác nhận session này.
- Font: Outfit.

## Evidence on Hand

- Code: `admin/src/` (App, Navbar, Sidebar, Login, pages Add/List/Orders/Dashboard), `frontend/src/` (cửa hàng công khai).
- Ảnh sản phẩm/assets trong `admin/src/assets/`, `frontend/src/assets/`.
- Không có testimonial/case study/press — không bịa ra.

## Product Principles

1. Ít thao tác hơn là nhiều tính năng — mọi task thường làm dưới vài click.
2. Quét được nhanh — số liệu và đơn hàng đọc lướt mắt là thấy.
3. Trung thực với dữ liệu thật — chỉ hiển thị gì backend trả về, không số liệu ảo.
4. Nhất quán monochrome — trắng đen + Outfit xuyên suốt admin.
5. Hoạt động được cả khi chưa đủ dữ liệu — empty state rõ ràng, không màn hình trắng.

## Accessibility & Inclusion

Yêu cầu chung web: tương phản đủ (đen/trắng), bàn phím hoạt động được, không chỉ dựa màu sắc để truyền trạng thái (kèm text/label).
