import React from 'react';

const Footer = ({
  productName = 'LeadScraper Pro',
  links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/50 px-5 py-4 text-sm text-slate-400 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p>
          Copyright {year} {productName}. Built for focused outbound teams.
        </p>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-slate-100"
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
