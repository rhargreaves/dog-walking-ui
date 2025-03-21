import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box as="header" bg="teal.500" color="white" p={4} shadow="md">
      <Flex align="center" maxW="1200px" mx="auto">
        <Heading size="md">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Dog Walking Service
          </Link>
        </Heading>
        <Spacer />
        <Button
          colorScheme="whiteAlpha"
          size="sm"
          onClick={() => navigate('/dogs/new')}
        >
          Add New Dog
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;