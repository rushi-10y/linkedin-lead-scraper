import React from 'react';

const Loader = ({
  size = 'md',
  fullScreen = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div
      className={`relative ${sizes[size] || sizes.md} ${className}`}
      aria-label="Loading"
      role="status"
    >
      <div className="absolute inset-0 rounded-full border border-cyan-300/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-300 border-r-sky-400 animate-spin" />
      <div className="absolute inset-[22%] rounded-full bg-cyan-300/25 blur-sm" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
