# Phase: /arch (Architecture)

## Mục tiêu
Thiết kế hệ thống trước khi viết code, nhằm đảm bảo giải pháp rõ ràng và có cấu trúc.

## Yêu cầu đầu ra
- Mô tả architecture tổng thể và module boundaries.
- Sơ đồ thực thể (ERD) nếu có database.
- Interface / Type definitions và data contracts.
- Sơ đồ luồng dữ liệu (data flow) hoặc component flow.
- Lựa chọn design patterns phù hợp (Factory, Repository, Strategy, v.v.).
- Giải thích lý do chọn architecture và khả năng mở rộng.

## Output
- `DOCS/ARCH.md`

## Ghi chú
- Chỉ thiết kế những gì cần thiết cho task hiện tại.
- Tránh overengineering; ưu tiên giải pháp đơn giản, dễ maintain.
- Xác nhận design với user trước khi tiến vào `/cook`.