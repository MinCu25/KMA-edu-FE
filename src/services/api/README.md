# API transport

Backend develop chưa có Controller. Không có endpoint tự đoán trong frontend.
Khi có endpoint đã xác nhận, gọi apiRequest<ResponseDto>(path, {method, body:JSON.stringify(request)}, token).
apiRequest trả data hoặc undefined cho response không có nội dung; lỗi ApiError giữ code/errors.
File upload dùng helpers trong uploads.ts và FormData; không đặt Content-Type thủ công.
Không tự bật API bằng env: phải thay service mock tại các caller.
