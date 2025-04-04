import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Container, Heading, SimpleGrid, Spinner, Text, useToast, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { dogService } from '../services/api';
import { Dog } from '../types';
import DogCard from './DogCard';

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const toast = useToast();

  const fetchDogs = useCallback(async (token?: string) => {
    try {
      if (token) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await dogService.getDogs({
        nextToken: token,
        limit: 12,
        name: searchName
      });

      if (token) {
        setDogs(prev => [...prev, ...response.dogs]);
      } else {
        setDogs(response.dogs);
      }

      setNextToken(response.nextToken || null);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching dogs:', err);
      const errorMessage = err.message || 'Failed to load dogs. Please try again later.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [toast, searchName]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDogs();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchDogs, searchName]);

  const handleLoadMore = () => {
    if (nextToken) {
      fetchDogs(nextToken);
    }
  };

  return (
    <Container maxW="1200px" mt={8}>
      <Heading mb={6}>Available Dogs</Heading>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search dogs by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            maxW="400px"
          />
        </InputGroup>
      </Box>

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
        <>
          <SimpleGrid columns={[1, null, 2, 3]} gap={6}>
            {dogs.map((dog) => (
              <Link key={dog.id} to={`/dogs/${dog.id}`} style={{ textDecoration: 'none' }}>
                <DogCard dog={dog} />
              </Link>
            ))}
          </SimpleGrid>

          {nextToken && (
            <Box mt={8} textAlign="center">
              <Button
                colorScheme="teal"
                isLoading={loadingMore}
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default DogList;