import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Flex align="center">
      <Box mr={4} textAlign="right">
        <Text fontSize="sm" fontWeight="medium">
          {user?.email || user?.username || 'User'}
        </Text>
      </Box>
      <Button
        size="sm"
        colorScheme="gray"
        variant="outline"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Flex>
  );
};

export default UserProfile;