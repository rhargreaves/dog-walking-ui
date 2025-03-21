import React from 'react';
import { Box, Heading, Text, Image } from '@chakra-ui/react';
import { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      {dog.photoUrl ? (
        <Image
          src={dog.photoUrl}
          alt={dog.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      ) : (
        <Box
          bg="gray.200"
          height="200px"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">No Image Available</Text>
        </Box>
      )}
      <Box p={4}>
        <Heading size="md" mb={2}>{dog.name}</Heading>
        {dog.breed && (
          <Text color="gray.600">Breed: {dog.breed}</Text>
        )}
      </Box>
    </Box>
  );
};

export default DogCard;