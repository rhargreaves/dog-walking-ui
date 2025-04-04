import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  Stack,
  Badge,
  HStack,
  Progress,
} from '@chakra-ui/react';
import { dogService } from '../services/api';
import { Dog } from '../types';

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const getEnergyEmoji = (level: number): string => {
  switch (level) {
    case 1: return '😴'; // Sleepy
    case 2: return '😌'; // Calm
    case 3: return '😄'; // Grinning
    case 4: return '🚀'; // Rocket
    case 5: return '🔥'; // Fire
    default: return '❓';
  }
};

const DogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pollingPhotoStatus, setPollingPhotoStatus] = useState(false);

  useEffect(() => {
    const fetchDog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const fetchedDog = await dogService.getDog(id);
        setDog(fetchedDog);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching dog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this dog?')) {
      return;
    }

    try {
      await dogService.deleteDog(id);
      navigate('/');
    } catch (err: unknown) {
      console.error('Error deleting dog:', err);
      alert(`Error deleting dog: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type is JPEG
      if (file.type !== 'image/jpeg') {
        alert('Only JPEG images are supported. Please select a JPEG file.');
        return;
      }

      // Upload the file immediately
      handleUploadFile(file);
    }
  };

  const handleUploadFile = useCallback(async (file: File) => {
    if (!id) return;

    try {
      setUploading(true);
      await dogService.uploadDogPhoto(id, file);

      // Start polling for status updates
      const startTime = Date.now();
      const pollInterval = 1000; // Check every second
      const maxDuration = 5000; // Poll for max 5 seconds
      setPollingPhotoStatus(true);

      const pollStatus = async () => {
        if (Date.now() - startTime > maxDuration) {
          // Stop polling after 5 seconds
          const updatedDog = await dogService.getDog(id);
          setDog(updatedDog);
          setPollingPhotoStatus(false);
          return;
        }

        const updatedDog = await dogService.getDog(id);
        setDog(updatedDog);

        // If status is still pending, continue polling
        if (updatedDog.photoStatus === 'pending') {
          setTimeout(pollStatus, pollInterval);
        } else {
          setPollingPhotoStatus(false);
        }
      };

      // Start the polling
      pollStatus();
    } catch (err: unknown) {
      console.error('Error uploading photo:', err);
      alert(`Error uploading photo: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPollingPhotoStatus(false);
    } finally {
      setUploading(false);
    }
  }, [id]);

  // Handler for processing and uploading pasted images
  const handlePaste = useCallback(async (event: globalThis.ClipboardEvent) => {
    if (!id || uploading) return;

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) {
        // Get the image as a file
        const file = items[i].getAsFile();
        if (!file) continue;

        // Validate it's a JPEG
        if (file.type !== 'image/jpeg') {
          alert('Only JPEG images are supported. The pasted image must be a JPEG.');
          return;
        }

        // Stop the default paste behavior
        event.preventDefault();

        // Upload the file
        await handleUploadFile(file);
        break;
      }
    }
  }, [id, uploading, handleUploadFile]);

  // Add and remove the paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  if (loading) {
    return (
      <Container maxW="1200px" mt={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading dog details...</Text>
      </Container>
    );
  }

  if (error || !dog) {
    return (
      <Container maxW="1200px" mt={8}>
        <Box bg="red.100" p={4} borderRadius="md" color="red.800">
          {error || 'Dog not found'}
        </Box>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to Dogs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" mt={8}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Box flex="1" overflow="hidden">
          {dog.photoUrl ? (
            <>
              <Image
                src={dog.photoUrl}
                alt={dog.name}
                borderRadius="lg"
                objectFit="cover"
                maxH="400px"
                w="100%"
              />
              {pollingPhotoStatus && (
                <Box
                  bg="blue.100"
                  p={3}
                  borderRadius="md"
                  color="blue.800"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Spinner size="sm" />
                  <Text>Checking photo status...</Text>
                </Box>
              )}
              {!pollingPhotoStatus && dog.photoStatus && dog.photoStatus !== 'approved' && (
                <Box
                  bg={
                    dog.photoStatus === 'rejected' ? 'red.100' : 'yellow.100'
                  }
                  p={3}
                  borderRadius="md"
                  color={
                    dog.photoStatus === 'rejected' ? 'red.800' : 'yellow.800'
                  }
                >
                  <Text>
                    {(() => {
                      switch (dog.photoStatus) {
                        case 'pending':
                          return <Text>Photo is being processed...</Text>;
                        case 'rejected':
                          return <Text>Photo rejected. Please be sure you are uploading a clear image of the dog.</Text>;
                        default:
                          return null;
                      }
                    })()}
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <Box
              bg="gray.200"
              height="400px"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500">No Image Available</Text>
            </Box>
          )}

          <Stack mt={4} spacing={4}>
            <Box>
              <input
                type="file"
                accept="image/jpeg"
                id="photo-upload"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <label htmlFor="photo-upload">
                <Button as="span" colorScheme="blue" width="100%" isDisabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </label>
              <Text mt={2} fontSize="sm" color="gray.600" textAlign="center">
                You can also paste an image directly (Ctrl+V/Cmd+V)
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box flex="1">
          <Heading size="xl" mb={2}>
            {dog.name}
          </Heading>
          <Text fontSize="xl" mb={4} color="gray.600">
            {dog.breed || 'Unknown'}
          </Text>

          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold">Basic Information</Text>
              <Stack spacing={2} mt={2}>
                <HStack>
                  <Text color="gray.600">Size:</Text>
                  <Badge colorScheme="blue">{dog.size}</Badge>
                </HStack>
                <HStack>
                  <Text color="gray.600">Sex:</Text>
                  <Badge colorScheme="green">{dog.sex}</Badge>
                </HStack>
                <HStack>
                  <Text color="gray.600">Energy Level:</Text>
                  <HStack>
                    <Progress value={dog.energyLevel * 20} colorScheme="yellow" size="sm" width="100px" />
                    <Text>{getEnergyEmoji(dog.energyLevel)}</Text>
                  </HStack>
                </HStack>
                {dog.dateOfBirth && (
                  <HStack>
                    <Text color="gray.600">Age:</Text>
                    <Text>{calculateAge(dog.dateOfBirth)} years old</Text>
                  </HStack>
                )}
                <HStack>
                  <Text color="gray.600">Neutered:</Text>
                  <Text color={dog.isNeutered ? 'green.500' : 'red.500'}>{dog.isNeutered ? 'Yes' : 'No'}</Text>
                </HStack>
              </Stack>
            </Box>

            {dog.socialization && (
              <Box>
                <Text fontWeight="bold">Socialization</Text>
                <Stack spacing={2} mt={2}>
                  <HStack>
                    <Text color="gray.600">Good with Children:</Text>
                    <Text color={dog.socialization.goodWithChildren ? 'green.500' : 'red.500'}>{dog.socialization.goodWithChildren ? 'Yes' : 'No'}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">Good with Large Dogs:</Text>
                    <Text color={dog.socialization.goodWithLargeDogs ? 'green.500' : 'red.500'}>{dog.socialization.goodWithLargeDogs ? 'Yes' : 'No'}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">Good with Puppies:</Text>
                    <Text color={dog.socialization.goodWithPuppies ? 'green.500' : 'red.500'}>{dog.socialization.goodWithPuppies ? 'Yes' : 'No'}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">Good with Small Dogs:</Text>
                    <Text color={dog.socialization.goodWithSmallDogs ? 'green.500' : 'red.500'}>{dog.socialization.goodWithSmallDogs ? 'Yes' : 'No'}</Text>
                  </HStack>
                </Stack>
              </Box>
            )}

            {dog.specialInstructions && (
              <Box>
                <Text fontWeight="bold">Special Instructions</Text>
                <Text mt={2} color="gray.600">{dog.specialInstructions}</Text>
              </Box>
            )}
          </Stack>

          <Stack mt={8} direction="row" spacing={4}>
            <Button
              colorScheme="teal"
              flex="1"
              onClick={() => navigate(`/dogs/${dog.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              flex="1"
            >
              Delete
            </Button>
          </Stack>

          <Button
            variant="outline"
            mt={4}
            width="100%"
            onClick={() => navigate('/')}
          >
            Back to Dogs
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default DogDetails;