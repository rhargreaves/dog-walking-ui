import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  Stack,
} from '@chakra-ui/react';
import { dogService } from '../services/api';
import { Dog } from '../types';

const DogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Partial<Dog>>({ name: '', breed: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!id;

  useEffect(() => {
    const fetchDog = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const fetchedDog = await dogService.getDog(id);
        setDog(fetchedDog);
        setError(null);
      } catch (err) {
        console.error('Error fetching dog:', err);
        setError('Failed to load dog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDog((prevDog) => ({ ...prevDog, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dog.name) {
      setError('Dog name is required');
      return;
    }

    try {
      setSaving(true);

      if (isEditing && id) {
        await dogService.updateDog(id, dog);
      } else {
        await dogService.createDog(dog as Omit<Dog, 'id'>);
      }

      navigate('/');
    } catch (err) {
      console.error('Error saving dog:', err);
      setError('Failed to save dog. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="600px" mt={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading dog details...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="600px" mt={8}>
      <Heading mb={6}>{isEditing ? 'Edit Dog' : 'Add New Dog'}</Heading>

      {error && (
        <Box bg="red.100" p={4} borderRadius="md" color="red.800" mb={6}>
          {error}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={dog.name || ''}
              onChange={handleInputChange}
              placeholder="Enter dog's name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Breed</FormLabel>
            <Input
              name="breed"
              value={dog.breed || ''}
              onChange={handleInputChange}
              placeholder="Enter dog's breed (optional)"
            />
          </FormControl>

          <Box pt={4} display="flex" justifyContent="space-between">
            <Button onClick={() => navigate('/')} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="teal"
              disabled={saving}
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Dog' : 'Add Dog')}
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export default DogForm;