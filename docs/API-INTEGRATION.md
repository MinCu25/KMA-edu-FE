# Bàn giao ghép API

## Phần frontend đã đồng bộ
- CreateSubjectRequest: credits nguyên 1–5. UpdateSubjectRequest: tên/tín chỉ bắt buộc; không gửi status. subjectCode là trường tùy chọn khi cập nhật; UI hiện giữ nguyên mã.
- SubjectResponse: có description, hiển thị lại mô tả khi sửa.
- SetPrerequisiteRequest: chỉ prerequisiteSubjectIds; [] gỡ hết; ID học phần đích tách khỏi body, chờ endpoint xác nhận.
- ChangePasswordRequest: gửi đầy đủ currentPassword/newPassword/confirmPassword; currentPassword=null khi requirePasswordChange=true, ẩn ô mật khẩu cũ; logout sau khi đổi thành công. Các quy tắc mật khẩu mạnh là yêu cầu UI của người dùng, DTO chỉ quy định tối thiểu 8 ký tự.
- ResetPasswordRequest: userId/reason. Không nhập mật khẩu thủ công. Chưa có email API nên không đổi mật khẩu, không báo thành công giả.
- Nhập điểm: UI lấy EnrollmentResponse.id từ service, không tính ID từ studentId/moduleClassId. Service mock cấp ID riêng chỉ để phát triển; thay bằng dữ liệu server khi tích hợp.
- Xếp lịch: danh mục phòng có ID riêng, không dùng chỉ số mảng. Đây vẫn là catalog mock, không phải ID database thật.
- Thời khóa biểu/xung đột: xét tất cả schedules và khoảng ngày; có Chủ nhật, xuất CSV các lịch trong tuần chọn.
- Hồ sơ sinh viên và lớp phụ trách giảng viên: xác định từ phiên đăng nhập trong fixture hiện tại; không dùng ID sinh viên=1 trong thao tác cập nhật. Khi tích hợp cần endpoint hồ sơ/lớp của người đang đăng nhập, không giả định userId=studentId hoặc username luôn là mã sinh viên.
- ChatResponse giữ messageId/intent/citations/scenario; UI có nguồn tham khảo và chỉ số tư vấn. roadmap là unknown: cần chốt schema trước khi dựng lộ trình.
- Form học vụ thêm/sửa dữ liệu hiển thị lỗi theo trường. useFormErrors.applyError hỗ trợ FieldErrorDetail từ ApiError.

## Chưa thể tích hợp chỉ bằng đổi VITE_API_BASE_URL
Mọi caller còn dùng service/context mock cần thay bằng API thật; không có endpoint tự đoán.
1. Xác nhận URL, HTTP method, path/query params, response envelope và cách xác thực từng API. Chưa kiểm kê hết endpoint/DTO mới ngoài 40 DTO đã đối chiếu.
2. Login/refresh/logout: JWT, hết hạn/401, lưu phiên và phân quyền phải nối backend. Browser local storage không phải cơ chế bảo mật thật.
3. Reset email: backend sinh mật khẩu, gửi email, đặt cờ requirePasswordChange. First-login đổi mật khẩu phải được backend kiểm soát; UI gate không thay thế server guard.
4. Lookup ngành/khóa/khoa/phòng/học kỳ: thay toàn bộ ID fixtures bằng ID response. Không gửi các ID fixtures vào database thật.
5. Phòng học CRUD, công bố/đóng đăng ký, khóa kỳ/điểm, mở khóa tài khoản, hủy đăng ký: cần endpoint chính thức; hiện thao tác cục bộ. Không kết luận thiếu DTO đồng nghĩa thiếu API (có thể dùng path/query).
6. Đăng ký: các ngưỡng 12–24 tín chỉ, thiếu tiên quyết, sức chứa vẫn mô phỏng. Backend phải quyết định và trả lỗi nghiệp vụ; cần thống nhất cấu trúc lý do chi tiết.
7. Tìm kiếm/phân trang: hiện client-side; nối PageResponse từ server và các filter hợp lệ. Không tải toàn bộ người dùng để phân trang ở quy mô thật.
8. Excel: đã có UI XLSX/CSV local, lỗi theo dòng, xem/điều chỉnh phân lớp. Cần thống nhất template và API preview/confirm/kết quả theo dòng; không gửi CSV cho API chỉ hỗ trợ XLSX.
9. Lịch sử AI, kỳ trước/điểm/hồ sơ/tổng quan: thay fixtures bằng response theo tài khoản. Cần API tải lịch sử, session messages. Không suy diễn schema roadmap.
10. Kiểm tra đồng bộ đa màn hình sau mutation: refetch/invalidate dữ liệu từ server; các context mock hiện chưa phải một database chung.

## Không cần sửa DTO backend để chiều frontend
Các trường optional, null, mã enum và ID phải lấy theo hợp đồng backend. Khi nhóm đổi hợp đồng, cập nhật types, builders, form và tests cùng lúc.

## Admin học vụ — đối chiếu 2026-11-02

Nguồn: `BF_UCS_and_IMAGESnew.pdf`, phần mô tả use case trang 69–107; backend develop `e658bc77b34ad4674ba42f23540350a6ab15e614`.

- Đã giữ đúng payload `CreateStudentRequest`, `UpdateStudentRequest`, `CreateLecturerRequest`, `CreateSubjectRequest`, `UpdateSubjectRequest`, `SetPrerequisiteRequest`, `CreateModuleClassRequest`, `CreateClassScheduleRequest`, `BatchImportStudentRequest`.
- Bổ sung `SubjectActionRequest { reason, confirmed }` và `SubjectSearchRequest`. Mã học phần giữ nguyên khi cập nhật, số tín chỉ 1–5 theo backend hiện tại. Backend có TODO kiểm tra điểm/lớp ở service học phần; FE kiểm tra dữ liệu local sẵn có, backend vẫn phải kiểm tra lại khi ghép API.
- Hồ sơ, tài khoản, lớp học phần, phòng và kỳ hiện lưu cục bộ trong trình duyệt. Không phải xác thực/phân quyền server. Tài khoản mới có `firstLogin=true`; tên đăng nhập là mã sinh viên/giảng viên, mật khẩu ban đầu `12345` theo UC nhập học. Mật khẩu local lưu bộ kiểm chứng PBKDF2, backend phụ trách bcrypt theo use case.
- Metadata CCCD/ngày sinh giảng viên, trạng thái gửi email, ID giảng viên của lớp, loại phòng yêu cầu, danh mục phòng, kỳ và hồ sơ nguồn tri thức là **view/local model riêng**, không thêm vào DTO response/request của backend.
- Chưa thấy DTO/controller hoàn chỉnh cho phòng, CRUD kỳ, điều chỉnh/hủy/công bố lớp, phân lớp preview/confirm, vô hiệu hóa sinh viên và quản trị tri thức. Không tự dựng endpoint rồi tuyên bố đã tích hợp. Cần thống nhất các contract này khi backend cung cấp.
- Import hỗ trợ XLSX/CSV. DTO import vẫn chỉ `majorId`, `cohortId`, `file`; giới hạn sĩ số/hệ đào tạo/phân lớp thủ công là trạng thái quy trình ở FE, không tự thêm vào multipart. CSV là hỗ trợ local, backend hiện ghi Excel. Chỉ gửi XLSX nếu API backend không hỗ trợ CSV.
- Chính sách local cần chốt với nhóm: mã sinh viên `CT<khóa><STT 5 số>`, mã lớp `<học phần>.<kỳ>.L<STT>`, phân bổ điểm giảm dần luân phiên hai chiều; tệp nhập 10 MB, tài liệu tri thức 20 MB, CCCD 12 số, điểm đầu vào 0–30. Tài liệu use case có chỗ để trống quy tắc định danh/cấu hình, nên đây không phải tuyên bố quy định backend đã tồn tại.
- Danh mục ngành/khóa/khoa hiện là dữ liệu local. Cần thay bằng lookup API để đáp ứng toàn trường; không tạo ID bằng vị trí trong danh sách.
- Email cấp tài khoản **chưa gửi**; lỗi/email chưa kết nối không làm mất hồ sơ và tài khoản đã tạo. Nút gửi lại nêu rõ thiếu API. Không báo email thành công giả.
- Nguồn tri thức lưu tệp ở IndexedDB và metadata + hash; tệp chưa tải lên server, chưa trích văn bản/chia đoạn/Embedding/RAG. Các trạng thái chờ xử lý, vô hiệu hóa, khôi phục, xóa metadata hoạt động ở FE; nút xử lý lại báo thiếu dịch vụ. Không đánh dấu nguồn hoạt động hay đưa nội dung chưa xử lý vào chatbot.
- Đổi lịch lớp đã có sinh viên: kiểm tra lịch theo roster đầy đủ; chặn khi số người có trong roster không khớp sĩ số lớp. Cần ghép API để mở luồng kiểm tra từng sinh viên và thông báo lịch thay đổi. FE không thể đảm bảo ràng buộc toàn trường dựa trên fixture.
- Công bố lớp và thời gian đăng ký tách biệt; lớp OPEN mới xuất hiện trong kỳ đang hiển thị. Dữ liệu đăng ký tách theo tài khoản, cập nhật sĩ số local khi đăng ký/hủy.


## Bản sửa tính nhất quán

Xem `ACCEPTANCE-MATRIX.md` để biết phần đã kiểm tra và giới hạn. Snapshot `backend-contract.json` đã được thay bằng 62 tệp ở commit develop nêu trên, không còn trộn snapshot cũ. `UserInfoResponse.email` đã được bổ sung; `firstLogin` và `PageResponse.last` giữ theo tên JSON suy ra từ Lombok/Jackson boolean getter, cần xác nhận bằng response thực.

`services/academic/domain.ts` chứa quy tắc dữ liệu dùng chung; `integrations.ts` là port FE cho email và xử lý nguồn (không phải DTO/backend endpoint). Khi bind adapter, processKnowledge phải resolve khi job terminal và đảm bảo thay phiên bản atomic; setKnowledgeActive/deleteKnowledge phải đồng bộ vector index. Không truyền nguyên local Source vào HTTP body: adapter phải map metadata theo hợp đồng BE. `fileStore.ts` chỉ giữ bản nháp Blob trên trình duyệt.

Luồng trạng thái, semester, room, admissions hiện còn thao tác qua context local. Đây chưa phải tầng API hoàn chỉnh. Trước triển khai thật phải thay các mutation này bằng service chính thức và invalidation, không chỉ cấu hình biến môi trường.
