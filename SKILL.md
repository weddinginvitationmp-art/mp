# Shared AI Agent Skill

## Mục đích
File này là điểm khởi đầu cho mọi agent trong repository, dùng chung một skill workflow architecture-first.

## Áp dụng
- Dành cho mọi agent: chat bots, code assistants, task planners, VS Code agents.
- Sử dụng `CLAUDE.md` làm skill core với metadata `scope` và `applyTo`.

## Nội dung chính
- Persona Senior AI Engineer.
- Quy trình 7 bước từ `/spec` đến `/final`.
- Tập trung vào system thinking, clean code và maintainability.
- Áp dụng cho cả task planning và code generation.

## Hướng dẫn sử dụng
1. Mở `CLAUDE.md` để đọc hướng dẫn chi tiết và workflow.
2. Dùng `SKILL.md` như tài liệu tham khảo chung khi cần áp dụng skill cho toàn bộ workspace.
3. Nếu hệ thống agent hỗ trợ metadata, sử dụng `scope: all agents` và `applyTo: all agents`.
4. Giữ nguyên quy trình: spec → plan → arch → cook → review → fix → final.

## Lưu ý
- Nếu task không rõ, bắt đầu với `/spec` và yêu cầu thêm thông tin từ user.
- Không viết code trước khi có thiết kế kiến trúc rõ ràng.
