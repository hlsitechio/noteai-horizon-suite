
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteDebugger: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Route changed:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  return null;
};

export default RouteDebugger;
