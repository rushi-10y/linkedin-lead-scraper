import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Simplified: always allow (add auth context later)
  return children;
};

export default PrivateRoute;
