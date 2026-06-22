'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email, password, redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="a-login-page">
      <form className="a-login-card" onSubmit={handleSubmit}>
        <div className="a-login-logo">
          <Image src="/assets/img/logo.png" alt="Ku Náay" width={140} height={36} />
          <span className="a-login-sub">Admin Panel</span>
        </div>

        {error && <div className="a-alert-error">{error}</div>}

        <div className="a-form-group">
          <label className="a-label">Email</label>
          <input
            className="a-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="a-form-group">
          <label className="a-label">Password</label>
          <input
            className="a-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-a btn-primary-a" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
