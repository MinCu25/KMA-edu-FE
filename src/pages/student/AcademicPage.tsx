import { useAuth } from "../../context/AuthContext";
import { Badge, Notice, Card } from "../../components/common";
import { useState } from "react";
import type { PageProps } from "../../types/navigation";
import { useDemoData } from "../../context/DemoDataContext";
import {
  gradeResponses as grades,
  academicSummary,
} from "../../data/mock/grades";
export default function AcademicPage({ onNavigate }: PageProps) {
  const { selected, target } = useDemoData();
  const { session } = useAuth();
  const [period, setPeriod] = useState(
    academicSummary.semesterGrades[0]?.semesterCode ?? "",
  );
  const semesterGrade = academicSummary.semesterGrades.find(
    (s) => s.semesterCode === period,
  );
  if (academicSummary.studentCode !== session?.user.username)
    return (
      <Card title="Học vụ cá nhân">
        Chưa có dữ liệu học vụ của tài khoản đang đăng nhập.
      </Card>
    );
  const go = onNavigate;
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Học vụ cá nhân</h1>
          <p>Chỉ xem, không chỉnh sửa. Dữ liệu của riêng bạn.</p>
        </div>
      </div>
      <Notice tone="yellow">{academicSummary.academicWarningStatus}</Notice>
      <Card title="Thông tin tổng quan">
        <div className="overview-info">
          {[
            ["MSSV", academicSummary.studentCode],
            ["Lớp", academicSummary.className],
            ["Ngành", academicSummary.majorName],
            ["Khóa", academicSummary.cohortCode],
            ["Hệ đào tạo", "Đại học chính quy"],
          ].map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
          <div>
            <span>Trạng thái</span>
            <Badge tone="yellow">{academicSummary.academicWarningStatus}</Badge>
          </div>
        </div>
      </Card>
      <div className="metric-grid">
        <Card>
          <span>GPA học kỳ</span>
          <strong>{semesterGrade?.semesterGpa?.toFixed(2) ?? "—"}</strong>
        </Card>
        <Card>
          <span>GPA tích lũy</span>
          <strong>
            {academicSummary.cumulativeGpa?.toFixed(2) ?? "—"} / 4.00
          </strong>
        </Card>
        <Card>
          <span>Tín chỉ tích lũy</span>
          <strong>
            {academicSummary.accumulatedCredits} /{" "}
            {academicSummary.totalRequiredCredits}
          </strong>
          <div className="progress-track">
            <i
              style={{
                width: `${academicSummary.totalRequiredCredits ? Math.min(100, (academicSummary.accumulatedCredits / academicSummary.totalRequiredCredits) * 100) : 0}%`,
              }}
            />
          </div>
        </Card>
        <Card>
          <span>GPA mục tiêu</span>
          <strong>{Number(target).toFixed(2)}</strong>
        </Card>
      </div>
      <Card
        title="Bảng điểm kỳ học"
        action={
          <select
            aria-label="Chọn học kỳ"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {academicSummary.semesterGrades.map((s) => (
              <option key={s.semesterCode} value={s.semesterCode}>
                {s.semesterCode}
              </option>
            ))}
            <option>HK_1 - 2026-2027</option>
          </select>
        }
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Học phần</th>
                <th>TC</th>
                <th>Điểm quá trình</th>
                <th>Tổng kết (10)</th>
                <th>Thang 4</th>
                <th>Điểm chữ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {semesterGrade
                ? semesterGrade.courses.map((g) => (
                    <tr key={g.subjectName}>
                      <td>{g.subjectName}</td>
                      <td>{g.credits}</td>
                      <td>{g.processScore?.toFixed(1) ?? "—"}</td>
                      <td>{g.courseScore10?.toFixed(1) ?? "—"}</td>
                      <td>{g.courseScore4?.toFixed(1) ?? "—"}</td>
                      <td>{g.courseScoreLetter ?? "—"}</td>
                      <td>
                        <Badge
                          tone={g.status === "COMPLETED" ? "green" : "red"}
                        >
                          {g.status === "COMPLETED" ? "Đạt" : "Rớt môn"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                : selected.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.credits}</td>
                      <td>—</td>
                      <td>—</td>
                      <td>—</td>
                      <td>—</td>
                      <td>
                        <Badge tone="blue">Đang học</Badge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="bottom-grid">
        <Card title="Học phần mở kỳ hiện tại">
          <div className="simple-row">
            <span>Cấu trúc dữ liệu</span>
            <Badge>Đủ điều kiện</Badge>
          </div>
          <div className="simple-row">
            <span>Hệ điều hành</span>
            <Badge tone="yellow">Thiếu: Kiến trúc máy tính</Badge>
          </div>
        </Card>
        <Card title="Đã đăng ký kỳ hiện tại">
          {selected.slice(0, 2).map((c) => (
            <div className="simple-row" key={c.id}>
              <span>{c.name}</span>
              <span>{c.credits} TC</span>
            </div>
          ))}
          <button className="text-button" onClick={() => go("register")}>
            Xem tất cả học phần →
          </button>
        </Card>
      </div>
    </>
  );
}
