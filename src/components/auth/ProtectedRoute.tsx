import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" />
          <Box mt={4}>Loading...</Box>
        </Box>
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;