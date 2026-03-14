import { useContext } from 'react';
import { LeadContext } from '../context/LeadContext.jsx';

const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within LeadProvider');
  }
  return context;
};

export default useLeads;
