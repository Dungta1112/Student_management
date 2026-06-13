import { useEffect, useState } from 'react';

import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'Quản trị viên',
  teacher: 'Giáo viên',
  student: 'Sinh viên',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user.role === 'admin') {
      api.get('/users/').then(({ data }) => setUsers(data)).catch(() => {});
    }
  }, [user.role]);

  const counts = users.reduce(
    (result, item) => ({ ...result, [item.role]: result[item.role] + 1 }),
    { admin: 0, teacher: 0, student: 0 },
  );

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Không gian làm việc</span>
          <h2>Thông tin quan trọng, ngay khi bạn cần.</h2>
          <p>
            Bạn đang đăng nhập với vai trò {roleLabels[user.role] || user.role}.
            Các chức năng được hiển thị theo đúng quyền tài khoản.
          </p>
        </div>
        <div className="hero-badge">{roleLabels[user.role] || user.role}</div>
      </section>

      {user.role === 'admin' ? (
        <section className="stats-grid">
          <article className="stat-card accent-blue">
            <span>Tổng tài khoản</span><strong>{users.length}</strong>
            <small>Đang có trong hệ thống</small>
          </article>
          <article className="stat-card accent-green">
            <span>Sinh viên</span><strong>{counts.student}</strong>
            <small>Tài khoản sinh viên</small>
          </article>
          <article className="stat-card accent-orange">
            <span>Giáo viên</span><strong>{counts.teacher}</strong>
            <small>Tài khoản giáo viên</small>
          </article>
          <article className="stat-card accent-purple">
            <span>Quản trị viên</span><strong>{counts.admin}</strong>
            <small>Tài khoản quản trị</small>
          </article>
        </section>
      ) : (
        <section className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>Tài khoản đã sẵn sàng</h3>
          <p>Bạn có thể xem và cập nhật thông tin tại trang hồ sơ cá nhân.</p>
        </section>
      )}
    </div>
  );
}
