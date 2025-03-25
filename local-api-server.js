const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3002;
const SECRET_KEY = '1234567890';

// Sample database for development
let dogs = [
  {
    id: '1',
    name: 'Rex',
    breed: 'German Shepherd',
    dateOfBirth: '2020-01-15',
    energyLevel: 4,
    isNeutered: true,
    sex: 'male',
    size: 'large',
    socialization: {
      goodWithChildren: true,
      goodWithLargeDogs: true,
      goodWithPuppies: true,
      goodWithSmallDogs: false
    },
    specialInstructions: 'Needs to be walked separately from small dogs'
  },
  {
    id: '2',
    name: 'Buddy',
    breed: 'Golden Retriever',
    dateOfBirth: '2019-06-20',
    energyLevel: 5,
    isNeutered: true,
    sex: 'male',
    size: 'large',
    socialization: {
      goodWithChildren: true,
      goodWithLargeDogs: true,
      goodWithPuppies: true,
      goodWithSmallDogs: true
    },
    specialInstructions: 'Loves to play fetch',
    photoUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3697.jpg',
    photoHash: 'hash2'
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Beagle',
    photoUrl: 'https://images.dog.ceo/breeds/beagle/n02088364_12124.jpg',
    photoHash: 'hash3'
  },
  {
    id: '4',
    name: 'Luna',
    breed: 'Labrador Retriever',
    photoUrl: 'https://images.dog.ceo/breeds/retriever-labrador/n02099712_1622.jpg',
    photoHash: 'hash4'
  },
  {
    id: '5',
    name: 'Bella',
    breed: 'Poodle',
    photoUrl: 'https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg',
    photoHash: 'hash5'
  },
  {
    id: '6',
    name: 'Charlie',
    breed: 'Bulldog',
    photoUrl: 'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg',
    photoHash: 'hash6'
  },
  {
    id: '7',
    name: 'Lucy',
    breed: 'Siberian Husky',
    sex: 'female',
    size: 'large',
    energyLevel: 5,
    dateOfBirth: '2017-01-15',
    isNeutered: true,
    photoUrl: 'https://images.dog.ceo/breeds/husky/n02110185_10047.jpg',
    photoHash: 'hash7'
  },
  {
    id: '8',
    name: 'Cooper',
    breed: 'Boxer',
    photoUrl: 'https://images.dog.ceo/breeds/boxer/n02108089_5128.jpg',
    photoHash: 'hash8'
  },
  {
    id: '9',
    name: 'Daisy',
    breed: 'Dachshund',
    photoUrl: 'https://images.dog.ceo/breeds/dachshund/dachshund-6.jpg',
    photoHash: 'hash9'
  },
  {
    id: '10',
    name: 'Rocky',
    breed: 'Rottweiler',
    photoUrl: 'https://images.dog.ceo/breeds/rottweiler/n02106550_9500.jpg',
    photoHash: 'hash10'
  },
  {
    id: '11',
    name: 'Sadie',
    breed: 'Shih Tzu',
    photoUrl: 'https://images.dog.ceo/breeds/shihtzu/n02086240_5044.jpg',
    photoHash: 'hash11'
  },
  {
    id: '12',
    name: 'Duke',
    breed: 'Doberman',
    photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_11303.jpg',
    photoHash: 'hash12'
  },
  {
    id: '13',
    name: 'Molly',
    breed: 'Chihuahua',
    photoUrl: 'https://images.dog.ceo/breeds/chihuahua/n02085620_8578.jpg',
    photoHash: 'hash13'
  },
  {
    id: '14',
    name: 'Tucker',
    breed: 'Australian Shepherd',
    photoUrl: 'https://images.dog.ceo/breeds/australian-shepherd/leroy.jpg',
    photoHash: 'hash14'
  },
  {
    id: '15',
    name: 'Zoe',
    breed: 'Great Dane',
    photoUrl: 'https://images.dog.ceo/breeds/dane-great/n02109047_28577.jpg',
    photoHash: 'hash15'
  }
];

app.use(cors());
app.use(bodyParser.json());
// Add raw body parser for handling image uploads
app.use('/api/dogs/:id/photo', (req, res, next) => {
  if (req.headers['content-type'] === 'image/jpeg') {
    let data = Buffer.from('');
    req.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: { code: 401, message: 'No token provided' }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { code: 401, message: 'Invalid token' }
    });
  }
};

// =================== Auth Endpoints ===================

// Login endpoint to generate JWT tokens
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  // In development, any username/password is accepted
  if (!username) {
    return res.status(400).json({
      error: { code: 400, message: 'Username is required' }
    });
  }

  // Generate an email from the username for development
  const email = `${username}@example.com`;

  // Create a payload for the token
  const payload = {
    username,
    email,
    roles: ['user'],
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };

  // Generate the token
  const token = jwt.sign(payload, SECRET_KEY);

  // Return the token
  res.json({ token, user: { username, email } });
});

// =================== API Endpoints ===================

// Get all dogs
app.get('/api/dogs', verifyToken, (req, res) => {
  // Extract nextToken, limit, and name from query parameters
  const { nextToken, limit = 12, name } = req.query;

  // Filter dogs by name if provided
  let filteredDogs = dogs;
  if (name) {
    const searchName = name.toLowerCase();
    filteredDogs = dogs.filter(dog =>
      dog.name.toLowerCase().includes(searchName)
    );
  }

  let startIndex = 0;
  if (nextToken) {
    // nextToken is the ID to start after
    const tokenIndex = filteredDogs.findIndex(d => d.id === nextToken);
    if (tokenIndex >= 0) {
      startIndex = tokenIndex + 1;
    }
  }

  // Convert limit to number
  const limitNum = parseInt(limit, 10);

  // Get slice of dogs based on pagination
  const endIndex = Math.min(startIndex + limitNum, filteredDogs.length);
  const dogsPage = filteredDogs.slice(startIndex, endIndex);

  // Calculate next token (if there are more dogs)
  const hasMore = endIndex < filteredDogs.length;
  const nextPageToken = hasMore ? filteredDogs[endIndex - 1].id : null;

  // Return in the format of DogList with dogs array and nextToken
  res.json({
    dogs: dogsPage,
    nextToken: nextPageToken
  });
});

// Get dog by ID
app.get('/api/dogs/:id', verifyToken, (req, res) => {
  const dog = dogs.find(d => d.id === req.params.id);
  if (!dog) {
    return res.status(404).json({
      error: { code: 404, message: 'Dog not found' }
    });
  }
  res.json(dog);
});

// Create a new dog
app.post('/api/dogs', verifyToken, (req, res) => {
  const {
    name,
    breed,
    dateOfBirth,
    energyLevel,
    isNeutered,
    sex,
    size,
    socialization,
    specialInstructions
  } = req.body;

  // Validate required fields
  if (!energyLevel || !sex || !size) {
    return res.status(400).json({
      error: { code: 400, message: 'energyLevel, sex, and size are required fields' }
    });
  }

  // Validate energyLevel range
  if (energyLevel < 1 || energyLevel > 5) {
    return res.status(400).json({
      error: { code: 400, message: 'energyLevel must be between 1 and 5' }
    });
  }

  // Validate sex values
  if (!['male', 'female'].includes(sex)) {
    return res.status(400).json({
      error: { code: 400, message: 'sex must be either "male" or "female"' }
    });
  }

  // Validate size values
  if (!['small', 'medium', 'large'].includes(size)) {
    return res.status(400).json({
      error: { code: 400, message: 'size must be either "small", "medium", or "large"' }
    });
  }

  const newDog = {
    id: (dogs.length + 1).toString(),
    name,
    breed,
    dateOfBirth,
    energyLevel,
    isNeutered,
    sex,
    size,
    socialization,
    specialInstructions
  };

  dogs.push(newDog);
  res.status(201).json(newDog);
});

// Update a dog
app.put('/api/dogs/:id', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: { code: 404, message: 'Dog not found' }
    });
  }

  const {
    name,
    breed,
    dateOfBirth,
    energyLevel,
    isNeutered,
    sex,
    size,
    socialization,
    specialInstructions
  } = req.body;

  // Validate energyLevel if provided
  if (energyLevel !== undefined) {
    if (energyLevel < 1 || energyLevel > 5) {
      return res.status(400).json({
        error: { code: 400, message: 'energyLevel must be between 1 and 5' }
      });
    }
    dogs[index].energyLevel = energyLevel;
  }

  // Validate sex if provided
  if (sex !== undefined) {
    if (!['male', 'female'].includes(sex)) {
      return res.status(400).json({
        error: { code: 400, message: 'sex must be either "male" or "female"' }
      });
    }
    dogs[index].sex = sex;
  }

  // Validate size if provided
  if (size !== undefined) {
    if (!['small', 'medium', 'large'].includes(size)) {
      return res.status(400).json({
        error: { code: 400, message: 'size must be either "small", "medium", or "large"' }
      });
    }
    dogs[index].size = size;
  }

  // Update other fields if provided
  if (name !== undefined) dogs[index].name = name;
  if (breed !== undefined) dogs[index].breed = breed;
  if (dateOfBirth !== undefined) dogs[index].dateOfBirth = dateOfBirth;
  if (isNeutered !== undefined) dogs[index].isNeutered = isNeutered;
  if (socialization !== undefined) dogs[index].socialization = socialization;
  if (specialInstructions !== undefined) dogs[index].specialInstructions = specialInstructions;

  // Don't allow direct updates to photoUrl or photoHash through this endpoint

  res.json(dogs[index]);
});

// Delete a dog
app.delete('/api/dogs/:id', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: { code: 404, message: 'Dog not found' }
    });
  }

  dogs = dogs.filter(d => d.id !== req.params.id);
  res.status(204).send();
});

// Placeholder for upload dog photo
app.put('/api/dogs/:id/photo', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: { code: 404, message: 'Dog not found' }
    });
  }

  // Check content type
  if (req.headers['content-type'] !== 'image/jpeg') {
    return res.status(400).json({
      error: { code: 400, message: 'Content-Type must be image/jpeg' }
    });
  }

  // Check if we received the binary data
  if (!req.rawBody) {
    return res.status(400).json({
      error: { code: 400, message: 'No image data received' }
    });
  }

  // In development, just pretend we uploaded a photo
  const randomNum = Math.floor(Math.random() * 9999);
  dogs[index].photoUrl = `https://images.dog.ceo/breeds/retriever-golden/n02099601_${randomNum}.jpg`;
  dogs[index].photoHash = `hash_${randomNum}`; // Add a random photoHash

  res.json(dogs[index]);
});

// Placeholder for detect breed from photo
app.post('/api/dogs/:id/photo/detect-breed', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: { code: 404, message: 'Dog not found' }
    });
  }

  // Check if the dog has a photo
  if (!dogs[index].photoUrl) {
    return res.status(400).json({
      error: { code: 400, message: 'No photo available for breed detection' }
    });
  }

  // In development, just return a random breed with confidence score
  const breeds = ['Golden Retriever', 'Labrador', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog'];
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  const confidence = Math.round((0.7 + Math.random() * 0.3) * 100); // Random confidence between 70 and 100

  // Update the dog's breed
  dogs[index].breed = randomBreed;

  // Return the detected breed information
  res.json({
    id: dogs[index].id,
    breed: randomBreed,
    confidence: confidence
  });
});

// Health check endpoint
app.get('/api/ping', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Local development server running at http://localhost:${PORT}`);
});