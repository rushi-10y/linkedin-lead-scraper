import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Shield, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import authService from '../../services/auth.service.js';
import { validateEmail, validateRequired } from '../../utils/validators.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthShell from '../../components/auth/AuthShell.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateRequired(email)) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email';

    if (!validateRequired(password)) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Use at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Operator Access"
      title="Walk into a darker, sharper control room for pipeline growth."
      description="Run premium lead acquisition workflows, monitor automation health, and surface the most actionable prospects from a single cinematic workspace."
      icon={Fingerprint}
      metrics={[
        { label: 'Uptime', value: '99.9%', copy: 'Stable crawler and export flow.' },
        { label: 'Signals', value: '24k+', copy: 'Profiles tracked across current campaigns.' },
        { label: 'Response Time', value: '<2s', copy: 'Fast access to dashboards and lead vaults.' }
      ]}
      highlights={[
        { icon: Shield, title: 'Trusted access', copy: 'Protected workspace entry with secure session handling for operators and admins.' },
        { icon: Sparkles, title: 'Signal-first workflow', copy: 'Every screen is tuned to prioritize momentum, clarity, and high-value lead visibility.' },
        { icon: Zap, title: 'Modern automation', copy: 'Trigger scraping flows, watch system health, and act on fresh data without leaving the dashboard.' }
      ]}
      footerText="Need a fresh workspace seat?"
      footerLabel="Create your account"
      footerTo="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="operator@company.com"
          error={errors.email}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="Enter your password"
          error={errors.password}
          required
          disabled={loading}
        />

        {errors.general && (
          <p className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errors.general}
          </p>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="mt-6 w-full"
          disabled={loading}
        >
          {loading ? 'Unlocking workspace...' : 'Enter the control room'}
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
