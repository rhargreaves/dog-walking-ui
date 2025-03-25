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
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  VStack,
} from '@chakra-ui/react';
import { dogService } from '../services/api';
import { Dog } from '../types';

const DogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Partial<Dog>>({
    name: '',
    breed: '',
    energyLevel: 3,
    sex: 'male',
    size: 'medium',
    socialization: {
      goodWithChildren: false,
      goodWithLargeDogs: false,
      goodWithPuppies: false,
      goodWithSmallDogs: false
    }
  });
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
      } catch (err: any) {
        console.error('Error fetching dog:', err);
        setError(err.message || 'Failed to load dog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('socialization.')) {
        const socializationKey = name.split('.')[1];
        setDog(prev => ({
          ...prev,
          socialization: {
            ...prev.socialization,
            [socializationKey]: checked
          }
        }));
      } else {
        setDog(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setDog(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (value: string, name: string) => {
    setDog(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dog.name || !dog.energyLevel || !dog.sex || !dog.size) {
      setError('Name, energy level, sex, and size are required fields');
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
    } catch (err: any) {
      console.error('Error saving dog:', err);
      setError(err.message || 'Failed to save dog. Please try again later.');
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

          <FormControl>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              name="dateOfBirth"
              type="date"
              value={dog.dateOfBirth || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Energy Level (1-5)</FormLabel>
            <NumberInput
              name="energyLevel"
              value={dog.energyLevel || 3}
              min={1}
              max={5}
              onChange={(value) => handleNumberChange(value, 'energyLevel')}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Is Neutered</FormLabel>
            <Switch
              name="isNeutered"
              isChecked={dog.isNeutered || false}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Sex</FormLabel>
            <Select
              name="sex"
              value={dog.sex || ''}
              onChange={handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Size</FormLabel>
            <Select
              name="size"
              value={dog.size || ''}
              onChange={handleInputChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Socialization</FormLabel>
            <VStack align="start" spacing={2}>
              <Checkbox
                name="socialization.goodWithChildren"
                isChecked={dog.socialization?.goodWithChildren || false}
                onChange={(e) => handleInputChange(e)}
              >
                Good with Children
              </Checkbox>
              <Checkbox
                name="socialization.goodWithLargeDogs"
                isChecked={dog.socialization?.goodWithLargeDogs || false}
                onChange={(e) => handleInputChange(e)}
              >
                Good with Large Dogs
              </Checkbox>
              <Checkbox
                name="socialization.goodWithPuppies"
                isChecked={dog.socialization?.goodWithPuppies || false}
                onChange={(e) => handleInputChange(e)}
              >
                Good with Puppies
              </Checkbox>
              <Checkbox
                name="socialization.goodWithSmallDogs"
                isChecked={dog.socialization?.goodWithSmallDogs || false}
                onChange={(e) => handleInputChange(e)}
              >
                Good with Small Dogs
              </Checkbox>
            </VStack>
          </FormControl>

          <FormControl>
            <FormLabel>Special Instructions</FormLabel>
            <Input
              name="specialInstructions"
              value={dog.specialInstructions || ''}
              onChange={handleInputChange}
              placeholder="Any special instructions for walking this dog"
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