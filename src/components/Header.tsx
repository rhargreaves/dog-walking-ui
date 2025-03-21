import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './auth/UserProfile';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box as="header" bg="teal.500" color="white" p={4} shadow="md">
      <Flex align="center" maxW="1200px" mx="auto">
        <Heading size="md">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Dog Walking Service
          </Link>
        </Heading>
        <Spacer />

        {isAuthenticated ? (
          <>
            <Button
              colorScheme="whiteAlpha"
              size="sm"
              mr={4}
              onClick={() => navigate('/dogs/new')}
            >
              Add New Dog
            </Button>
            <UserProfile />
          </>
        ) : (
          <Button
            colorScheme="whiteAlpha"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Header;