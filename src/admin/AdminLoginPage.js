import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, loginAdmin, setAdminToken } from './adminApi';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await loginAdmin(form);
      setAdminToken(result.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-auth-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Admin Furusato</p>
          <h1>Masuk Dashboard</h1>
          <p>Login terlebih dahulu untuk mengelola informasi dan gambar.</p>
        </div>

        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="user"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="password"
            required
          />
        </label>

        {error && <div className="admin-error">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
