import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024; // Default open on desktop
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Handle window resize to toggle sidebar
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist theme
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      theme,
      setTheme
    }),
    [sidebarOpen, theme]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
