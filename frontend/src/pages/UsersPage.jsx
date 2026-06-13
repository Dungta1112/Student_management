import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  username: '',
  first_name: '',
  last_name: '',
  full_name: '',
  email: '',
  role: 'student',
  student_code: '',
  date_of_birth: '',
  phone_number: '',
  enrollment_date: '',
  is_active: true,
  password: '',
};

const roleLabels = {
  admin: 'Quản trị viên',
  teacher: 'Giáo viên',
  student: 'Sinh viên',
};

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    const { data } = await api.get('/users/');
    setUsers(data);
  };

  useEffect(() => {
    if (user.role === 'admin') loadUsers().catch(() => setError('Không tải được dữ liệu.'));
  }, [user.role]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((item) =>
      [
        item.username,
        item.first_name,
        item.last_name,
        item.full_name,
        item.student_code,
        item.email,
        item.role,
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    );
  }, [search, users]);

  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item, password: '' });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      student_code: form.student_code || null,
      date_of_birth: form.date_of_birth || null,
      enrollment_date: form.enrollment_date || null,
    };
    if (!payload.password) delete payload.password;

    try {
      if (editingId) {
        await api.patch(`/users/${editingId}/`, payload);
      } else {
        await api.post('/users/', payload);
      }
      await loadUsers();
      setShowForm(false);
    } catch (requestError) {
      const details = requestError.response?.data;
      setError(
        details?.username?.[0] ||
        details?.password?.[0] ||
        'Không thể lưu tài khoản. Vui lòng kiểm tra dữ liệu.',
      );
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Xóa tài khoản "${item.username}"?`)) return;
    try {
      await api.delete(`/users/${item.id}/`);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Không thể xóa tài khoản.');
    }
  };

  return (
    <section className="content-card">
      <div className="section-heading users-heading">
        <div>
          <span className="eyebrow">Quản trị hệ thống</span>
          <h2>Quản lý tài khoản</h2>
        </div>
        <button className="button button-primary" onClick={openCreate}>
          + Thêm tài khoản
        </button>
      </div>

      <div className="table-toolbar">
        <input
          className="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo tên, email hoặc vai trò..."
        />
        <span>{filteredUsers.length} tài khoản</span>
      </div>

      {error && !showForm && <div className="alert alert-error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>
                    {item.full_name ||
                      [item.first_name, item.last_name].filter(Boolean).join(' ') ||
                      item.username}
                  </strong>
                  <small>{item.email || `@${item.username}`}</small>
                </td>
                <td><span className={`role role-${item.role}`}>{roleLabels[item.role]}</span></td>
                <td>{item.is_active ? 'Hoạt động' : 'Đã khóa'}</td>
                <td>{new Date(item.date_joined).toLocaleDateString('vi-VN')}</td>
                <td className="row-actions">
                  <button onClick={() => openEdit(item)}>Sửa</button>
                  <button className="danger-link" onClick={() => handleDelete(item)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <form className="modal" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">{editingId ? 'Cập nhật' : 'Tạo mới'}</span>
                <h2>{editingId ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h2>
              </div>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="form-grid compact">
              <label>
                Tên đăng nhập
                <input
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  required
                />
              </label>
              <label>
                Vai trò
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                >
                  <option value="student">Sinh viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </label>
              <label>
                Họ
                <input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} />
              </label>
              <label>
                Tên
                <input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} />
              </label>
              <label className="field-wide">
                Họ và tên hiển thị
                <input
                  value={form.full_name || ''}
                  onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                />
              </label>
              <label>
                Mã sinh viên
                <input
                  value={form.student_code || ''}
                  onChange={(event) => setForm({ ...form, student_code: event.target.value })}
                />
              </label>
              <label>
                Số điện thoại
                <input
                  value={form.phone_number || ''}
                  onChange={(event) => setForm({ ...form, phone_number: event.target.value })}
                />
              </label>
              <label>
                Ngày sinh
                <input
                  type="date"
                  value={form.date_of_birth || ''}
                  onChange={(event) => setForm({ ...form, date_of_birth: event.target.value })}
                />
              </label>
              <label>
                Ngày nhập học
                <input
                  type="date"
                  value={form.enrollment_date || ''}
                  onChange={(event) => setForm({ ...form, enrollment_date: event.target.value })}
                />
              </label>
              <label className="field-wide">
                Email
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>
              <label className="field-wide">
                {editingId ? 'Mật khẩu mới' : 'Mật khẩu'}
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder={editingId ? 'Để trống nếu giữ mật khẩu cũ' : ''}
                  required={!editingId}
                />
              </label>
              <label className="checkbox-label field-wide">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                />
                Cho phép tài khoản đăng nhập
              </label>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="button button-ghost" onClick={() => setShowForm(false)}>Hủy</button>
              <button className="button button-primary">Lưu tài khoản</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
