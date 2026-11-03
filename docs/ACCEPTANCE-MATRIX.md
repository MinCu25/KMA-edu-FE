# Đối chiếu và nghiệm thu FE — 2026-11-02

**Chưa phải biên bản nghiệm thu tích hợp.** Nguồn: BF_UCS_and_IMAGESnew.pdf (mô tả use case trang 69–107), backend develop tại commit `e658bc77b34ad4674ba42f23540350a6ab15e614`. Snapshot 62 tệp được tải lại ở commit này. Không khẳng định đây là mọi API của repository hoặc mọi quy tắc triển khai trên server.

| Phạm vi / actor | Hợp đồng đã biết | FE đã xử lý | Chứng cứ / phần còn thiếu |
|---|---|---|---|
| Đăng nhập, đổi mật khẩu / cả 4 actor | LoginRequest/Response, ChangePasswordRequest | Vai trò, cổng đổi mật khẩu lần đầu, lỗi theo trường, logout sau đổi mật khẩu, vô hiệu phiên local khi credential đổi ở tab khác | Tests credential/first-login/lock; chưa test JWT, refresh, revoke server và đăng nhập qua trình duyệt |
| Đặt lại mật khẩu / Admin hệ thống | ResetPasswordRequest userId/reason | Không nhập mật khẩu cấp lại; không báo gửi mail thành công khi chưa gửi | Test unavailable boundary; backend phải sinh tạm, gửi email, đặt cờ lần đầu |
| Sinh viên / Admin học vụ | Create/Update/SearchStudentRequest, StudentResponse | Validate nhiều trường, xem chi tiết, lọc ngành/khóa/lớp/trạng thái; chặn sửa/tái kích hoạt hồ sơ DELETED; kiểm tra tài khoản liên kết trước đổi trạng thái | Test transition guard; endpoint trạng thái và liên kết userId–studentId cần xác nhận; username=MSSV chỉ là mapping local |
| Giảng viên / Admin học vụ | CreateLecturerRequest, LecturerResponse | Validate, bộ lọc, xem chi tiết qua tên, gửi lại email qua integration port | Render test; lookup khoa và endpoint email cần BE |
| Học phần, tiên quyết / Admin học vụ và Sinh viên | Create/UpdateSubjectRequest, SetPrerequisiteRequest, SubjectActionRequest | Giữ mã bất biến, tín chỉ 1–5, kiểm tra điểm kỳ trước, không xóa mềm khi có lịch sử; canonical prerequisite/requiredBy, chặn tự phụ thuộc/chu trình; đăng ký đọc tiên quyết đã sửa | Tests cycle/canonical/history guard; backend cần kiểm tra đầy đủ điểm và các quan hệ trên database |
| Phòng / Admin học vụ | RoomRecord là local view model | Validate, lọc, ngừng dùng, kiểm tra sức chứa/lịch đang dùng | Chưa có hợp đồng CRUD phòng chính thức trong tập đã đối chiếu; chưa thể gọi API chỉ bằng đổi baseURL |
| Kỳ / Admin học vụ | SemesterResponse | CRUD local, ngày/đăng ký, khóa/kết thúc chỉ xem; chặn xóa kỳ đang chọn để tránh trạng thái mồ côi | Endpoint CRUD/lock/delete và xung đột dữ liệu đồng thời cần BE |
| Mở lớp / Admin học vụ | CreateModuleClassRequest | Form mở nhiều lớp ở trang rộng; phân công; số chỗ; hiển thị đối chiếu CurriculumResponse khi có dữ liệu | Chưa có dữ liệu CTĐT và nhu cầu thực tế. Không tự suy ra số người cần đăng ký từ sĩ số; catalog ngành/khóa còn local |
| Lịch / Admin học vụ, Giảng viên, Sinh viên | CreateClassScheduleRequest, ClassScheduleResponse | Nhiều buổi, khoảng ngày, phòng đúng loại/sức chứa; conflict giảng viên theo ID; đối chiếu lịch từng sinh viên nếu roster đầy đủ; lý do đổi lịch, đánh dấu lịch đổi | Tests ID/overlap/student-conflict; thiếu roster thì chặn có giải thích; API phải kiểm tra toàn trường một cách atomic |
| Cập nhật/hủy/công bố lớp / Admin học vụ | Local transition; chưa chốt request chính thức | Chọn theo bộ lọc, kiểm tra từng lớp; chặn hủy lớp đã phát sinh đăng ký/điểm, kể cả đã hủy đăng ký local | Lịch sử trước khi bản sửa lưu enrollmentHistory có thể chưa đủ; cần lịch sử server để quyết định chắc chắn |
| Nhập học / Admin học vụ | BatchImportStudentRequest majorId/cohortId/file | XLSX/CSV local, lỗi theo dòng, phân lớp/điều chỉnh, tạo tài khoản firstLogin; tùy chọn dùng lại hồ sơ khớp nhận dạng và tài khoản ACTIVE, giữ mật khẩu/lịch sử; lưu kết quả đợt gần nhất | Allocation/account tests; chưa test toàn luồng upload bằng browser; template chính thức, preview/confirm, chính sách cấp mã, ngành/khóa/hệ và atomic import cần BE |
| Nguồn AI / Admin học vụ | Local Source + AcademicIntegrations, không giả làm DTO BE | Giữ Blob ở IndexedDB, metadata/hash/version; progress/error/retry port; chưa có adapter thì báo rõ chưa xử lý; không giả READY | Chưa có API extract/chunk/embed/index/version thực; IndexedDB không thay lưu trữ server; job adapter phải xử lý replacement atomic |
| Lọc, bảng, thông báo / toàn giao diện | PageResponse / FieldErrorDetail | Pager tự về trang hợp lệ, lỗi form tại trường; lỗi chung nằm trong form, success/info 2.5s; menu thao tác lớp gọn hơn | SSR cả 9 trang học vụ; chưa nghiệm thu responsive/keyboard trên toàn bộ màn hình |

## Kiểm tra đã chạy

- `npm run typecheck`: kiểm tra TypeScript.
- `npm test`: 43 bộ tên trường DTO so snapshot; kiểm thử requests/null/zero/multipart/HTTP lỗi; validation; credential/first-login/lock; tiên quyết, phân bổ, xung đột, đồng bộ subject/class và guard trạng thái; server-render 9 trang học vụ.
- Build production qua Sites helper.
- Browser preview mở được màn hình đăng nhập. Chưa có phiên xác thực để kiểm tra các trang nội bộ; SSR không thay thế browser interaction hoặc kiểm tra bố cục responsive.

## Điều kiện để gọi “sẵn sàng ghép API”

1. BE cung cấp OpenAPI hoặc bảng endpoint/method/request/response/status cùng ví dụ lỗi và nullable; xác nhận JSON `firstLogin`/`last` do boolean getter Jackson mặc định (Java fields `isFirstLogin`/`isLast`).
2. Có lookup IDs ngành/khóa/khoa/phòng/kỳ, mapping user–student–lecturer, roster đầy đủ, lịch sử enrollment/điểm và CTĐT. Không dùng fixture IDs với database thật.
3. Chốt các hợp đồng đang thiếu ở bảng trên; không sửa DTO chỉ để giữ hành vi tự đặt của FE.
4. Thay context/mock callers bằng API adapters, refetch sau mutation, phân trang phía server, xử lý 401/403/409/422/500 và retry idempotent.
5. Chạy integration/E2E bốn vai trò: nhiều lỗi cùng form, dữ liệu rỗng, trùng định danh, import một phần, rollback, khóa tài khoản, đổi mật khẩu lần đầu, trùng lịch, hủy/đăng ký lại, gửi mail thất bại, AI thất bại/retry; kiểm tra desktop/mobile và quyền server.

Các bước cần API thật chưa được đánh dấu hoàn tất. Không thể đảm bảo “chỉ đổi URL là xong” khi những hợp đồng và dữ liệu này chưa có.
