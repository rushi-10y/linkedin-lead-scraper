import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import leadService from '../services/lead.service.js';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);

  const fetchLeads = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await leadService.getLeads({ limit: 100 });
      setLeads(response.data || response.leads || []);
    } catch (err) {
      console.error('Fetch leads error:', err);
      setError(err.message || 'Failed to load leads');
      setLeads([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const addLead = async (lead) => {
    try {
      const newLead = await leadService.createLead(lead);
      setLeads((prev) => [newLead.data || newLead, ...prev]);
    } catch (err) {
      console.error('Add lead error:', err);
      throw err;
    }
  };

  const updateLead = async (id, updates) => {
    try {
      const updatedLead = await leadService.updateLead(id, updates);
      setLeads((prev) =>
        prev.map((lead) =>
          (lead.id === id || lead._id === id) ? (updatedLead.data || updatedLead) : lead
        )
      );
    } catch (err) {
      console.error('Update lead error:', err);
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
    } catch (err) {
      console.error('Delete lead error:', err);
      throw err;
    }
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
