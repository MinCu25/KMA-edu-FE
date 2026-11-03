# Đối chiếu DTO develop

Nguồn: CanhhTran-01/edu-hub, commit 0c2220775f5292db40a54bf13143f0a22039052f.
Không có controller Java ở snapshot này. Chưa kiểm thử HTTP với Spring Boot thực.

| Khu vực      | DTO / hành vi hiện tại                                                                                                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sinh viên    | CreateStudentRequest cần fullName, majorId, cohortId, administrativeClassId; không tự nhập studentCode. UpdateStudentRequest có liên hệ, ngày sinh, lớp, GPA mục tiêu, statusReason. Search dùng StudentSearchRequest.      |
| Giảng viên   | CreateLecturerRequest: tên, ngày sinh, email, điện thoại, citizenId, facultyId, reason. Chưa có DTO sửa giảng viên nên không giả định request sửa.                                                                          |
| Học phần     | CreateSubjectRequest / UpdateSubjectRequest; tín chỉ 1–10. SetPrerequisiteRequest sử dụng mảng ID, chọn nhiều; kiểm tra chu trình minh họa.                                                                                 |
| Lớp học phần | CreateModuleClassRequest: subjectId, semesterId, lecturerId, moduleClassCode, maxCapacity. Tạo lớp chưa xếp lịch.                                                                                                           |
| Lịch         | CreateClassScheduleRequest tách khỏi tạo lớp; roomId, dayOfWeek 2–8, lessonOrderStart/End, startDate/endDate. Một lớp có nhiều lịch trong bảng admin.                                                                       |
| Đăng ký      | RegisterModuleClassRequest gửi ID số moduleClassId. Đọc ApiResponse<RegistrationResult>. Hủy vẫn là mô phỏng cục bộ vì chưa có endpoint.                                                                                    |
| Điểm         | UpdateProcessScoreRequest dùng enrollmentId, componentScore1/2 number hoặc null, note. Không dùng mã sinh viên làm enrollmentId. Các ID đăng ký được tạo xác định trong mock; phải thay bằng ID response thật khi tích hợp. |
| Học vụ       | EnrollmentResponse giữ null cho điểm chưa có; giao diện hiển thị dấu gạch, số 0 vẫn là 0. StudentAcademicSummaryResponse và SemesterGradeResponse mô tả tổng quan.                                                          |
| Học kỳ       | SemesterResponse dùng LocalDate ISO. isLocked khóa thông tin, lockedGrade khóa điểm riêng. Công bố/khóa là thao tác mô phỏng, chưa có request DTO.                                                                          |
| Đăng nhập    | LoginRequest → ApiResponse<LoginResponse>; session có user, tokens, requirePasswordChange. Demo trả requirePasswordChange=false; phải bổ sung luồng bắt buộc đổi mật khẩu khi nối xác thực thật.                            |
| Mật khẩu     | ChangePasswordRequest kiểm tra tối thiểu 8 ký tự và xác nhận; không thay credential thật. LockUserRequest cần userId/reason; ResetPasswordRequest cần userId, reason tùy chọn.                                              |
| Chat         | ChatRequest có message tối đa 2000 ký tự, sessionId; ChatResponse có content, messageId, intent, citations, scenario. Demo không tạo trích dẫn giả; citations=[], scenario=null.                                            |
| HTTP         | apiRequest bóc data, giữ code/errors để gắn lỗi vào form; hỗ trợ 204 và multipart không tự đặt Content-Type.                                                                                                                |

## Quy ước và giới hạn

- ID Java Long dùng number, cần backend cam kết không vượt Number.MAX_SAFE_INTEGER; nếu vượt phải thống nhất chuỗi và sửa contract.
- BigDecimal hiện theo JSON number; LocalDate/LocalDateTime theo chuỗi ISO. Không quy đổi thời gian không múi giờ thành UTC một cách ngầm định.
- Lombok boolean `isFirstLogin`/`isLast` thường sinh getter `isFirstLogin()`/`isLast()` và Jackson property `firstLogin`/`last`. FE dùng tên wire này. Boolean wrapper `isLocked` giữ tên `isLocked`. Cần kiểm tra JSON thực tế hoặc OpenAPI khi backend chạy.
- Các field String như role/status không có enum trong DTO vẫn là string. Nhãn/vai trò mẫu không phải quy ước backend đã xác nhận.
- Danh mục ngành, khóa, khoa, phòng dùng lookup ID mẫu. Phải thay bằng dữ liệu API danh mục thật; không tái sử dụng ID mẫu trong hệ thống thật.
- Mã sinh viên/giảng viên, timestamp và enrollmentId ở mock không mô tả thuật toán cấp mã của backend.
- Các bảng view cũ (Course, Student, RecordRow) chỉ phục vụ UI. DTO được chuyển qua adapter; không serialize các object này lên server.
- Danh sách đăng ký / thời khóa biểu sinh viên và bảng admin dùng fixtures theo cùng DTO, nhưng chưa mô phỏng đầy đủ đồng bộ nhiều người dùng. Lịch bổ sung được hiển thị đầy đủ ở bảng admin; lịch sinh viên hiện dùng lịch fixture ban đầu. Backend thật phải cung cấp TimetableResponse.
- Điểm giảng viên lưu cục bộ; không tự tính hoặc công bố điểm tổng kết, không giả định công thức điểm.
- Dashboard, phòng học, phân quyền, nhật ký, cài đặt vẫn là UI minh họa. Không có DTO tương ứng để khẳng định đã nối backend.
- Chưa tạo upload Excel thực; có helper FormData cho BatchImportStudentRequest và BatchUpdateScoreRequest.
- Chưa có pagination thực từ server. PageResponse<T> có sẵn kiểu cho bước tích hợp.

## Khi backend sẵn sàng

1. Nhận OpenAPI hoặc danh sách endpoint + HTTP method, base URL, JSON ví dụ, quy ước role/status.
2. Kiểm tra cách serialize boolean, nullable fields, token refresh và permission.
3. Thay mock bằng service gọi apiRequest, lấy ID từ response, thay lookup mẫu bằng danh mục thật.
4. Bổ sung loading/error/pagination, first-login và token refresh theo endpoint đã thống nhất.
5. Kiểm thử tích hợp đăng ký → lịch, nhập điểm → bảng điểm, CORS và quyền truy cập.
