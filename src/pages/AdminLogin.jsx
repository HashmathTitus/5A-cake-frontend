import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axiosClient';
import { showToast } from '../components/common/Toast';
import { Spinner } from '../components/common/Loading';
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { heroBannerImage, logoAsset, heroBackdropSoftImage } from '../utils/imageAssets';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      login(response.data.admin, response.data.token);
      showToast('Login successful', 'success');
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbf7f2_0%,#f7efe5_100%)] p-4 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.14)] lg:grid-cols-[1fr_0.9fr]">
        <div className="relative hidden lg:block">
          <img src={heroBannerImage} alt="5A Events" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.8),rgba(15,23,42,0.3))]" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <img src={logoAsset} alt="5A Events" className="h-16 w-16 rounded-3xl object-cover shadow-xl" />
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-amber-300">Admin control center</p>
            <h1 className="mt-3 max-w-xl text-5xl font-semibold leading-tight">Manage events and guest feedback with clarity and style.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">A seeded admin account is created from your environment variables when the backend starts.</p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[linear-gradient(180deg,#fffaf4_0%,#fff_100%)] px-4 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-amber-50 text-amber-700 lg:mx-0">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <p className="eyebrow">Administrator login</p>
              <h2 className="text-4xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm leading-6 text-slate-600">Sign in with the seeded admin credentials to access the dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@5aevents.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin@12345"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-amber-500"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button type="submit" disabled={loading} className="premium-button-primary w-full">
                {loading ? <Spinner size="sm" /> : <><span>Login to dashboard</span><ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4 text-sm text-slate-700">
              The backend seeds one administrator from <span className="font-semibold">ADMIN_EMAIL</span> and <span className="font-semibold">ADMIN_PASSWORD</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
