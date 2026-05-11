import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import authService from '../../services/auth.service.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthShell from '../../components/auth/AuthShell.jsx';
import {
  validateEmail,
  validateRequired,
  validateMinLength
} from '../../utils/validators.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) newErrors.name = 'Name is required';
    if (!validateRequired(formData.email)) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email';

    if (!validateRequired(formData.password)) newErrors.password = 'Password is required';
    else if (!validateMinLength(formData.password, 6)) newErrors.password = 'Use at least 6 characters';

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Workspace Provisioning"
      title="Create a premium outbound cockpit for your team in minutes."
      description="Spin up a modern lead operations workspace with a dark, focused interface that keeps scraping workflows, dashboards, and enrichment actions aligned."
      icon={UserPlus}
      metrics={[
        { label: 'Seats', value: 'Unlimited', copy: 'Scale your operator roster without changing the visual system.' },
        { label: 'Channels', value: '4', copy: 'Google, LinkedIn, websites, and manual triggers in one stack.' },
        { label: 'Sync', value: 'Realtime', copy: 'Lead context and status move instantly across the dashboard.' }
      ]}
      highlights={[
        { icon: ShieldCheck, title: 'Admin-ready setup', copy: 'Create a secure operator identity and step straight into the dashboard with session-ready credentials.' },
        { icon: Users, title: 'Team-grade foundations', copy: 'Built for shared lead operations with fast onboarding and strong visibility into the pipeline.' },
        { icon: Sparkles, title: 'Premium visual language', copy: 'Purposeful contrast, luminous accents, and restrained motion make the app feel like a real product.' }
      ]}
      footerText="Already have operator credentials?"
      footerLabel="Return to sign in"
      footerTo="/login"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jordan Rivera"
          error={errors.name}
          required
          disabled={loading}
        />

        <Input
          label="Work Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jordan@company.com"
          error={errors.email}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a secure password"
          error={errors.password}
          required
          disabled={loading}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
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
          {loading ? 'Provisioning workspace...' : 'Create my workspace'}
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
