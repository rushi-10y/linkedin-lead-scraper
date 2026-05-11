import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button'
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold tracking-[0.01em] transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:pointer-events-none disabled:opacity-45';

  const variants = {
    primary:
      'border-cyan-200/20 bg-[linear-gradient(135deg,rgba(103,232,249,0.96),rgba(45,212,191,0.92))] text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.22)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(34,211,238,0.28)]',
    gradient:
      'border-amber-200/10 bg-[linear-gradient(135deg,rgba(103,232,249,0.94),rgba(59,130,246,0.88),rgba(245,158,11,0.88))] text-slate-950 shadow-[0_18px_48px_rgba(59,130,246,0.24)] hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(59,130,246,0.34)]',
    secondary:
      'border-white/10 bg-white/[0.05] text-slate-100 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.08]',
    ghost:
      'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-slate-50',
    danger:
      'border-rose-300/20 bg-rose-500/[0.14] text-rose-100 hover:-translate-y-0.5 hover:bg-rose-500/20'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-base'
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
