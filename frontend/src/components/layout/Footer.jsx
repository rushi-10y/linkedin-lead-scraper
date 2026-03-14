import React from 'react';

const Footer = ({
  productName = 'LeadScraper Pro',
  links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }
  ]
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          © {year} {productName}. All rights reserved.
        </p>

        <div className="flex space-x-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
