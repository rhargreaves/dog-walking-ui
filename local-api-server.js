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
    photoUrl: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6694.jpg',
    photoHash: 'hash1'
  },
  {
    id: '2',
    name: 'Buddy',
    breed: 'Golden Retriever',
    photoUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3697.jpg',
    photoHash: 'hash2'
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Beagle',
    photoUrl: 'https://images.dog.ceo/breeds/beagle/n02088364_12124.jpg',
    photoHash: 'hash3'
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
  // Extract nextToken from query parameters (for pagination)
  const { nextToken } = req.query;

  // In a real implementation, we would use the nextToken to fetch the next page
  // For this mock server, we'll just return all dogs for any request

  // Return in the format of DogList with dogs array and nextToken
  res.json({
    dogs: dogs,
    nextToken: null // For pagination in the future
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
  // Extract only the properties defined in the API spec
  const { name, breed } = req.body;

  const newDog = {
    id: (dogs.length + 1).toString(),
    name,
    breed,
    // photoUrl and photoHash will be added when a photo is uploaded
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

  // Extract only the properties defined in the API spec
  const { name, breed } = req.body;

  // Update only the properties that are allowed to be updated
  if (name !== undefined) dogs[index].name = name;
  if (breed !== undefined) dogs[index].breed = breed;

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