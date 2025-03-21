import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { dogService } from '../services/api';
import { Dog } from '../types';
import DogCard from './DogCard';

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const data = await dogService.getAllDogs();
        setDogs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dogs:', err);
        setError('Failed to load dogs. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [toast]);

  return (
    <Container maxW="1200px" mt={8}>
      <Heading mb={6}>Available Dogs</Heading>

      {loading && (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading dogs...</Text>
        </Box>
      )}

      {error && (
        <Box bg="red.100" p={4} borderRadius="md" color="red.800">
          {error}
        </Box>
      )}

      {!loading && !error && dogs.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">No dogs found. Add your first dog!</Text>
        </Box>
      )}

      {!loading && !error && dogs.length > 0 && (
        <SimpleGrid columns={[1, null, 2, 3]} gap={6}>
          {dogs.map((dog) => (
            <Link key={dog.id} to={`/dogs/${dog.id}`} style={{ textDecoration: 'none' }}>
              <DogCard dog={dog} />
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default DogList;