import { useAuth } from "../context/AuthContext";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  Shield,
  Settings,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Brand } from "../components/common";
import { DemoFooter } from "../components/common/DemoFooter";
import {
  academicAdminNavigation,
  lecturerNavigation,
  systemNavigation,
  roleNames,
  roleHome,
} from "../config/navigation";
import type { PageProps, Page, Role } from "../types/navigation";
type Props = PageProps & {
  children: ReactNode;
  onLogout: () => void;
  page: Page;
  role: Role;
};
export default function AdminLayout({
  children,
  onNavigate,
  onLogout,
  page,
  role,
}: Props) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const menu =
    role === "lecturer"
      ? lecturerNavigation
      : role === "system-admin"
        ? systemNavigation
        : academicAdminNavigation;
  const icons = [
    LayoutDashboard,
    Users,
    BookOpen,
    CalendarDays,
    Shield,
    ClipboardList,
    Settings,
  ];
  return (
    <div
      className={"app admin-app management-app " + (open ? "sidebar-open" : "")}
    >
      <button
        className="sidebar-shade"
        aria-label="Đóng menu"
        onClick={() => setOpen(false)}
      />
      <aside className="admin-sidebar">
        <Brand />
        <span className="sidebar-caption">KHÔNG GIAN LÀM VIỆC</span>
        <div className="role-switch">
          <strong>{roleNames[role]}</strong>
        </div>
        <nav className="admin-menu">
          {menu.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <button
                key={item.id}
                className={page === item.id ? "selected" : ""}
                aria-current={page === item.id ? "page" : undefined}
                onClick={() => {
                  onNavigate(item.id);
                  setOpen(false);
                }}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="admin-bottom">
          <button onClick={onLogout}>
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>
      </aside>
      <main>
        <header className="management-topbar">
          <div>
            <button
              className="btn mobile-sidebar-toggle"
              aria-label="Mở menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span>{roleNames[role]}</span>
            <ChevronRight size={13} />
            <b>{menu.find((m) => m.id === page)?.label}</b>
          </div>
          <div className="staff-account">
            <span className="staff-avatar">
              {role === "lecturer"
                ? "QH"
                : role === "system-admin"
                  ? "HT"
                  : "HV"}
            </span>
            <span>
              <b>{session?.user.fullName}</b>
              <small>{session?.user.username}</small>
            </span>
          </div>
        </header>
        {children}
        <DemoFooter onNavigate={onNavigate} admin />
      </main>
    </div>
  );
}
