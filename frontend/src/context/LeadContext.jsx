import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);

  const fetchLeads = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent duplicate calls

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Simulated API
      // await new Promise((res) => setTimeout(res, 1000));

      setLeads([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Tech Corp',
          status: 'new',
          value: 5000,
          source: 'linkedin',
          createdAt: '2025-01-20'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@acme.com',
          company: 'Acme Inc',
          status: 'contacted',
          value: 12000,
          source: 'manual',
          createdAt: '2025-01-18'
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@startup.io',
          company: 'StartupIO',
          status: 'qualified',
          value: 8500,
          source: 'scrape',
          createdAt: '2025-01-15'
        }
      ]);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLead = (id, updates) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, ...updates } : lead
      )
    );
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  // 🔥 Derived helpers (very useful)
  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      totalValue: leads.reduce((sum, l) => sum + (l.value || 0), 0)
    };
  }, [leads]);

  const value = useMemo(
    () => ({
      leads,
      loading,
      error,
      stats,
      fetchLeads,
      addLead,
      updateLead,
      deleteLead
    }),
    [leads, loading, error, stats, fetchLeads]
  );

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
