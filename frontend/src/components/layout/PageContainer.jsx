import React from 'react';

const PageContainer = ({
  children,
  className = '',
  as: Component = 'div',
  padded = true,
  fullWidth = false
}) => {
  const widthClasses = fullWidth ? '' : 'max-w-7xl mx-auto';
  const paddingClasses = padded ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <Component className={`${widthClasses} ${paddingClasses} ${className}`}>
      {children}
    </Component>
  );
};

export default PageContainer;
