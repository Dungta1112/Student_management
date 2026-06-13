import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="brand brand-light">
          <span className="brand-mark">S</span>
          <strong>Student Hub</strong>
        </div>
        <div className="intro-copy">
          <span className="eyebrow">Quản lý rõ ràng, vận hành gọn nhẹ</span>
          <h1>Một nơi cho mọi thông tin học tập.</h1>
          <p>
            Theo dõi tài khoản và hồ sơ người dùng trong một giao diện đơn giản,
            dễ sử dụng trên cả máy tính và điện thoại.
          </p>
        </div>
        <div className="intro-stats">
          <div><strong>3</strong><span>Vai trò</span></div>
          <div><strong>JWT</strong><span>Bảo mật</span></div>
          <div><strong>24/7</strong><span>Truy cập</span></div>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Chào mừng trở lại</span>
          <h2>Đăng nhập hệ thống</h2>
          <p>Sử dụng tài khoản được cấp để tiếp tục.</p>

          <label>
            Tên đăng nhập
            <input
              autoFocus
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              placeholder="Nhập tên đăng nhập"
              required
            />
          </label>

          <label>
            Mật khẩu
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="Nhập mật khẩu"
              required
            />
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="button button-primary button-block" disabled={submitting}>
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </section>
    </div>
  );
}
