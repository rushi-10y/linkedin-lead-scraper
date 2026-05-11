import React from 'react';

const Input = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const inputId = id || name;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
        >
          {label} {required && <span className="text-rose-300">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-2xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition duration-300 focus:outline-none ${
          error
            ? 'border-rose-400/50 focus:border-rose-300 focus:ring-2 focus:ring-rose-400/30'
            : 'border-white/10 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20'
        } disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/[0.03] ${className}`}
        {...rest}
      />

      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
};

export default Input;
