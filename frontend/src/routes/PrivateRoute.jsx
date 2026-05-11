import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';

const PrivateRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const allowLocalDevBypass = import.meta.env.DEV;

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated && !allowLocalDevBypass) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
