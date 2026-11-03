import type { Course } from "../../types/course";
type ChatInput = {
  question: string;
  target: string;
  selected: Course[];
  credits: number;
};
export async function getDemoReply({
  question: q,
  target,
  selected,
  credits,
}: ChatInput): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (/gpa|tốt nghiệp|mục tiêu/i.test(q))
    return `Theo dữ liệu minh họa: GPA tích lũy 3.21, đã hoàn thành 78/130 tín chỉ. Với GPA mục tiêu ${target}, GPA trung bình cần đạt cho 52 tín chỉ còn lại là ${((Number(target) * 130 - 3.21 * 78) / 52).toFixed(2)}/4.00. Đây là tính toán minh họa; cần đối chiếu quy chế chính thức và dữ liệu điểm thực tế.`;
  if (/lịch/i.test(q))
    return `Bạn đã đăng ký ${selected.length} học phần (${credits} tín chỉ). ${selected.map((c) => `${c.name}: thứ ${c.day}, tiết ${c.start}-${c.end}`).join("; ")}.`;
  return "Để đăng ký môn, chọn Đăng ký học phần, kiểm tra điều kiện và bấm Đăng ký tại lớp đủ điều kiện. Những lớp thiếu tiên quyết, trùng lịch hoặc đã đầy sẽ không đăng ký được. ";
}
