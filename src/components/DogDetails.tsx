import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { dogService } from '../services/api';
import { Dog } from '../types';

const DogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const fetchDog = async () => {
      if (!id) return;

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
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this dog?')) {
      return;
    }

    try {
      await dogService.deleteDog(id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting dog:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!id || !photoFile) return;

    // Validate file type is JPEG
    if (photoFile.type !== 'image/jpeg') {
      alert('Only JPEG images are supported. Please select a JPEG file.');
      return;
    }

    try {
      setUploading(true);
      await dogService.uploadDogPhoto(id, photoFile);

      // Refresh dog data to show updated photo
      const updatedDog = await dogService.getDog(id);
      setDog(updatedDog);

      setPhotoFile(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDetectBreed = async () => {
    if (!id) return;

    try {
      setDetecting(true);
      const updatedDog = await dogService.detectBreed(id);
      setDog(updatedDog);
    } catch (err) {
      console.error('Error detecting breed:', err);
    } finally {
      setDetecting(false);
    }
  };

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
        <Box flex="1">
          {dog.photoUrl ? (
            <Image
              src={dog.photoUrl}
              alt={dog.name}
              borderRadius="lg"
              objectFit="cover"
              maxH="400px"
              w="100%"
            />
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
              />
              <label htmlFor="photo-upload">
                <Button as="span" colorScheme="blue" width="100%">
                  Select Photo
                </Button>
              </label>
            </Box>

            {photoFile && (
              <Button
                colorScheme="green"
                onClick={handleUploadPhoto}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            )}

            {dog.photoUrl && (
              <Button
                colorScheme="purple"
                onClick={handleDetectBreed}
                disabled={detecting}
              >
                {detecting ? 'Detecting...' : 'Detect Breed'}
              </Button>
            )}
          </Stack>
        </Box>

        <Box flex="1">
          <Heading size="xl" mb={2}>
            {dog.name}
          </Heading>
          <Text fontSize="xl" mb={4} color="gray.600">
            Breed: {dog.breed || 'Unknown'}
          </Text>

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