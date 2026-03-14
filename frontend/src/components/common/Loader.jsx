import React from 'react';

const Loader = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  const colors = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color]} ${className}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
