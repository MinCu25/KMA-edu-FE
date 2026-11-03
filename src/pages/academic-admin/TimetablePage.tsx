import { useState } from "react";
import { useAcademic } from "../../context/AcademicContext";
import { useManagement } from "../../context/ManagementContext";
import { exportCsv } from "../../utils/exportCsv";
export default function TimetablePage() {
  const a = useAcademic(),
    m = useManagement();
  const [term, setTerm] = useState(m.semester.semesterCode),
    [teacher, setTeacher] = useState(""),
    [room, setRoom] = useState(""),
    [date, setDate] = useState("");
  const rows = a.data.classes
    .filter(
      (c) =>
        c.status !== "CANCELLED" &&
        c.semesterCode === term &&
        (!teacher || c.lecturerName === teacher),
    )
    .flatMap((c) =>
      c.schedules
        .filter(
          (s) =>
            (!room || s.roomCode === room) &&
            (!date || (s.startDate! <= date && s.endDate! >= date)),
        )
        .map((s) => ({ c, s })),
    );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Thời khóa biểu</h1>
          <p>Tra cứu lịch học theo kỳ, giảng viên và phòng học.</p>
        </div>
        <button
          className="btn"
          onClick={() =>
            exportCsv("thoi-khoa-bieu.csv", [
              [
                "Lớp",
                "Học phần",
                "Giảng viên",
                "Thứ",
                "Tiết đầu",
                "Tiết cuối",
                "Phòng",
                "Từ ngày",
                "Đến ngày",
              ],
              ...rows.map(({ c, s }) => [
                c.moduleClassCode,
                c.subjectName,
                c.lecturerName,
                s.dayOfWeek!,
                s.lessonOrderStart!,
                s.lessonOrderEnd!,
                s.roomCode,
                s.startDate ?? "",
                s.endDate ?? "",
              ]),
            ])
          }
        >
          Xuất CSV
        </button>
      </div>
      <section className="card admissions-card">
        <div className="admin-filter">
          <label>
            Kỳ học
            <select value={term} onChange={(e) => setTerm(e.target.value)}>
              {a.terms.map((t) => (
                <option key={t.id} value={t.semesterCode}>
                  {t.semesterName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Giảng viên
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            >
              <option value="">Tất cả</option>
              {a.data.teachers.map((t) => (
                <option key={t.id}>{t.fullName}</option>
              ))}
            </select>
          </label>
          <label>
            Phòng
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
              <option value="">Tất cả</option>
              {a.rooms.map((r) => (
                <option key={r.id}>{r.roomCode}</option>
              ))}
            </select>
          </label>
          <label>
            Ngày trong khoảng học
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div className="academic-week">
          {Array.from({ length: 7 }, (_, i) => (
            <section key={i}>
              <h3>{i === 6 ? "Chủ nhật" : `Thứ ${i + 2}`}</h3>
              {rows
                .filter(({ s }) => s.dayOfWeek === i + 2)
                .sort((a, b) => a.s.lessonOrderStart! - b.s.lessonOrderStart!)
                .map(({ c, s }) => (
                  <article key={s.id}>
                    <b>
                      Tiết {s.lessonOrderStart}–{s.lessonOrderEnd}
                    </b>
                    <strong>{c.subjectName}</strong>
                    <span>{c.moduleClassCode}</span>
                    <span>{c.lecturerName}</span>
                    <span>Phòng {s.roomCode}</span>
                    <small>
                      {s.startDate} → {s.endDate}
                    </small>
                  </article>
                ))}
            </section>
          ))}
        </div>
        {!rows.length && (
          <p className="empty-state">Không có lịch học phù hợp với bộ lọc.</p>
        )}
      </section>
    </>
  );
}
