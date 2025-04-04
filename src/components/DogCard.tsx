import React from 'react';
import { Box, Heading, Text, Image, Badge, Stack, HStack } from '@chakra-ui/react';
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
        <Box position="relative">
          <Image
            src={dog.photoUrl}
            alt={dog.name}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          {dog.photoStatus && (
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme={
                dog.photoStatus === 'approved' ? 'green' :
                dog.photoStatus === 'rejected' ? 'red' :
                'yellow'
              }
            >
              {dog.photoStatus.charAt(0).toUpperCase() + dog.photoStatus.slice(1)}
            </Badge>
          )}
        </Box>
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
        <Stack spacing={2}>
          {dog.breed && (
            <Text color="gray.600">{dog.breed}</Text>
          )}
          <HStack spacing={2}>
            <Badge colorScheme="blue">{dog.size}</Badge>
            <Badge colorScheme="green">{dog.sex}</Badge>
            <Badge colorScheme="purple">Energy: {dog.energyLevel}/5</Badge>
          </HStack>
          {dog.socialization && (
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Socialization:</Text>
              <HStack spacing={2} wrap="wrap">
                {dog.socialization.goodWithChildren && <Badge colorScheme="teal">Good with Children</Badge>}
                {dog.socialization.goodWithLargeDogs && <Badge colorScheme="teal">Good with Large Dogs</Badge>}
                {dog.socialization.goodWithPuppies && <Badge colorScheme="teal">Good with Puppies</Badge>}
                {dog.socialization.goodWithSmallDogs && <Badge colorScheme="teal">Good with Small Dogs</Badge>}
              </HStack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default DogCard;