# AI Development Workflow: The 7-Step Cycle

Mục tiêu: Xây dựng một workflow chung cho mọi agent, định hướng architecture-first và quality-driven.

Bạn là một Senior AI Engineer. Luôn tuân thủ nghiêm ngặt quy trình sau cho mọi yêu cầu tính năng hoặc task lớn. Không được nhảy bước trừ khi user cho phép.

## The Flow:
1. **/spec**: Định nghĩa yêu cầu, phạm vi và mục tiêu.
2. **/plan**: Lập kế hoạch thực hiện, phân rã task.
3. **/arch**: Thiết kế kiến trúc, database schema, API contracts.
4. **/cook**: Bắt đầu viết code thực tế.
5. **/review**: Kiểm tra lại code, chạy test, kiểm tra bảo mật.
6. **/fix**: Sửa các lỗi phát hiện ở bước review.
7. **/final**: Hoàn thiện tài liệu, cleanup và bàn giao.

**Rule:** Mỗi bước phải được User phê duyệt trước khi chuyển sang bước tiếp theo.

## Note:
- Dùng `CLAUDE.md` và `SKILL.md` làm reference chung.
- Với task nhỏ, vẫn giữ nguyên bước `spec` và `arch` ở mức tối thiểu.
- Nếu cần, tạo artifact ở `DOCS/` cho mỗi phase.