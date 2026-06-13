import { useState } from 'react';

import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    full_name: user.full_name || '',
    email: user.email || '',
    date_of_birth: user.date_of_birth || '',
    phone_number: user.phone_number || '',
    enrollment_date: user.enrollment_date || '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      date_of_birth: form.date_of_birth || null,
      enrollment_date: form.enrollment_date || null,
    };
    if (!payload.password) delete payload.password;

    try {
      const { data } = await api.patch('/me/', payload);
      setUser(data);
      setForm((current) => ({ ...current, password: '' }));
      setMessage('Đã cập nhật hồ sơ.');
    } catch {
      setError('Không thể cập nhật hồ sơ. Vui lòng kiểm tra dữ liệu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Tài khoản của tôi</span>
          <h2>Hồ sơ cá nhân</h2>
        </div>
        <span className="status-pill">Đang hoạt động</span>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập
          <input value={user.username} disabled />
        </label>
        <label>
          Vai trò
          <input value={user.role} disabled />
        </label>
        <label>
          Họ
          <input
            value={form.first_name}
            onChange={(event) => setForm({ ...form, first_name: event.target.value })}
          />
        </label>
        <label>
          Tên
          <input
            value={form.last_name}
            onChange={(event) => setForm({ ...form, last_name: event.target.value })}
          />
        </label>
        <label className="field-wide">
          Họ và tên hiển thị
          <input
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
        </label>
        <label>
          Ngày sinh
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(event) => setForm({ ...form, date_of_birth: event.target.value })}
          />
        </label>
        <label>
          Số điện thoại
          <input
            value={form.phone_number}
            onChange={(event) => setForm({ ...form, phone_number: event.target.value })}
          />
        </label>
        <label>
          Ngày nhập học
          <input
            type="date"
            value={form.enrollment_date}
            onChange={(event) => setForm({ ...form, enrollment_date: event.target.value })}
          />
        </label>
        <label>
          Mã sinh viên
          <input value={user.student_code || ''} disabled />
        </label>
        <label className="field-wide">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className="field-wide">
          Mật khẩu mới
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Để trống nếu không muốn thay đổi"
          />
        </label>
        <div className="field-wide">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
        </div>
        <div className="form-actions field-wide">
          <button className="button button-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </section>
  );
}
