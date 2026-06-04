# Use Guide: Tích hợp bộ skill vào mọi dự án

## Mục đích
`USE_GUIDE.md` hướng dẫn cách tích hợp bộ AI Agent Skill chung này vào một dự án cụ thể, bao gồm:
- cách dùng `CLAUDE.md` và `SKILL.md` làm baseline,
- cách xây dựng file tổng quan dự án riêng (project-specific overview),
- cách maintain khi code base đã có sẵn.

## Khi bắt đầu với một dự án mới
1. Đọc `CLAUDE.md` để hiểu persona, quy tắc và workflow 7 bước.
2. Đọc `SKILL.md` để hiểu scope chung và cách áp dụng skill cho mọi agent.
3. Mở các file trong `.claudecode/workflow/` để nắm chi tiết từng phase.
4. Tạo một file tổng quan dự án riêng, ví dụ `Booking_FLM_Overall.md`.

## Cấu trúc file tổng quan dự án
File tổng quan nên chứa ít nhất các phần sau:
- `Project Overview`: Mục tiêu chính và bối cảnh dự án.
- `Scope`: Phạm vi hiện tại và non-goals.
- `Tech Stack`: Ngôn ngữ, framework, database, toolchain.
- `Codebase Summary`: Cấu trúc thư mục, module chính, component core.
- `Integration Points`: Nơi agent nên can thiệp hoặc trả lời.
- `Project-specific Workflow`: Nếu có biến thể của workflow 7 bước.
- `Maintenance Notes`: Những phần cần update khi code thay đổi.

## Ví dụ tên file
- `Booking_FLM_Overall.md`
- `ProjectName_Overview.md`
- `MyApp_AgentGuide.md`

## Cách lấy thông tin từ code base hiện có
1. Đọc file khởi động chính của dự án (entry point) và cấu trúc thư mục.
2. Xác định các module core, service, API, domain models.
3. Ghi lại các luồng chính: user flows, data flows, integration flows.
4. Tìm các điểm cần chú ý khi sử dụng agent: config, environment variables, authorization.

## Cập nhật file tổng quan khi dự án thay đổi
- Mỗi lần có thay đổi lớn về requirement hoặc architecture, cập nhật lại file overview.
- Nếu bổ sung module mới, thêm section `New modules` + `Impact on agent workflow`.
- Nếu codebase có refactor, cập nhật `Codebase Summary` và `Integration Points`.
- Giữ các file MD này trong repo để agent và team cùng tham chiếu.

## Với mỗi dự án có code base sẵn
1. Khởi tạo file tổng quan ở thư mục gốc hoặc `DOCS/`.
2. Đặt tên rõ ràng theo dự án.
3. Chỉ ra các phần đã sẵn sàng cho agent: data contract, API boundary, expected outputs.
4. Nếu cần, tạo thêm file cụ thể cho các module quan trọng.

## Kết luận
Bộ skill này là nền tảng chung. Với mỗi dự án, bạn cần build thêm một layer dự án riêng bằng file overview và giữ nó cập nhật theo source code để agent có thể sử dụng chính xác.
