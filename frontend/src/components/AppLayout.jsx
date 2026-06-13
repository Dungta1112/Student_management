import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'Quản trị viên',
  teacher: 'Giáo viên',
  student: 'Sinh viên',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>Student Hub</strong>
            <small>Quản lý đào tạo</small>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard">Tổng quan</NavLink>
          {user.role === 'admin' && <NavLink to="/users">Tài khoản</NavLink>}
          <NavLink to="/profile">Hồ sơ cá nhân</NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <small>{roleLabels[user.role] || user.role}</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Hệ thống quản lý sinh viên</span>
            <h1>Xin chào, {displayName}</h1>
          </div>
          <button className="button button-ghost" onClick={logout}>
            Đăng xuất
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
