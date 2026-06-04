# Phase: /review → /fix → /final

## /review
- Chạy static analysis và lint.
- Đảm bảo unit/integration tests pass.
- Kiểm tra logic lỗi và edge cases.
- Review hiệu năng và độ phức tạp (Big O nếu có ảnh hưởng).
- Kiểm tra security issues hoặc inputs không tin cậy.
- Đối chiếu kết quả với spec, plan, và arch.

## /fix
- Sửa code hoặc tài liệu theo feedback từ `/review` và user.
- Tái chạy test và kiểm tra lại những thay đổi.
- Tối ưu code nếu cần, nhưng giữ nguyên tính đúng đắn.

## /final
- Cập nhật README hoặc tài liệu liên quan nếu thay đổi hành vi.
- Xóa log debug và code tạm.
- Viết changelog, summary của thay đổi, hoặc release note ngắn.
- Chuẩn bị phần output/answer cho user, nêu rõ những gì đã hoàn thành.
- Đề xuất bước tiếp theo hoặc verify checklist cho user.

## Ghi chú
- `/final` nên kết thúc bằng một tóm tắt rõ ràng cho user.
- Nếu task chưa hoàn toàn rõ, báo lại phần cần clarifications cho user.