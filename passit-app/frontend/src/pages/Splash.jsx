import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios';
import '../styles/Splash.css';

export default function Splash() {
  const [name, setName]               = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const { setStudentName } = useApp();
  const navigate = useNavigate();

  const passwordsMatch = password === confirm;
  const canSubmit = name.trim() && password && confirm && passwordsMatch && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/students/login', { name: name.trim(), password });
      if (res.data.success) {
        setStudentName(name.trim());
        navigate('/subjects');
      } else {
        setError(res.data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="splash-root">

      {/* ── Left panel — image + branding ── */}
      <div className="splash-left">
        <div className="splash-left-overlay" />
        <div className="splash-left-content">

          <div className="splash-top">
            <span className="splash-logo">PassIt</span>
          </div>

          <div className="splash-middle">
            <h1 className="splash-tagline">
              Your BECE success<br />starts here
            </h1>
            <p className="splash-sub">
              Practice past questions and walk into that exam ready.
            </p>
          </div>

          <div className="splash-bottom">
            <p className="splash-trust">
              Trusted by BECE students across Ghana
            </p>
          </div>

        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="splash-right">
        <div className="splash-form">
          <h2 className="form-heading">Welcome!<br />What is your name?</h2>
          <p className="form-sub">Enter your details to get started or sign back in.</p>

          <label className="form-label" htmlFor="student-name">Your name</label>
          <input
            id="student-name"
            className="form-input"
            type="text"
            placeholder="e.g. Kofi Mensah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <label className="form-label" htmlFor="student-password">Password</label>
          <input
            id="student-password"
            className="form-input"
            type="password"
            placeholder="Choose or enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <label className="form-label" htmlFor="student-confirm">Confirm Password</label>
          <input
            id="student-confirm"
            className={`form-input${confirm && !passwordsMatch ? ' form-input--error' : ''}`}
            type="password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {confirm && !passwordsMatch && (
            <p className="form-error">Passwords do not match.</p>
          )}

          {error && <p className="form-error">{error}</p>}

          <button
            className="form-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {loading ? 'Please wait…' : 'Let\'s Go'}
          </button>
        </div>
      </div>

    </div>
  );
}
