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
    age: 3,
    size: 'Large',
    description: 'Friendly and energetic',
    image: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6694.jpg'
  },
  {
    id: '2',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 2,
    size: 'Medium',
    description: 'Loves to play fetch',
    image: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3697.jpg'
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Beagle',
    age: 4,
    size: 'Small',
    description: 'Friendly and good with kids',
    image: 'https://images.dog.ceo/breeds/beagle/n02088364_12124.jpg'
  }
];

app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// =================== Auth Endpoints ===================

// Login endpoint to generate JWT tokens
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  // In development, any username/password is accepted
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
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
  res.json(dogs);
});

// Get dog by ID
app.get('/api/dogs/:id', verifyToken, (req, res) => {
  const dog = dogs.find(d => d.id === req.params.id);
  if (!dog) {
    return res.status(404).json({ error: 'Dog not found' });
  }
  res.json(dog);
});

// Create a new dog
app.post('/api/dogs', verifyToken, (req, res) => {
  const newDog = {
    id: (dogs.length + 1).toString(),
    ...req.body
  };
  dogs.push(newDog);
  res.status(201).json(newDog);
});

// Update a dog
app.put('/api/dogs/:id', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dog not found' });
  }

  const updatedDog = {
    ...dogs[index],
    ...req.body
  };

  dogs[index] = updatedDog;
  res.json(updatedDog);
});

// Delete a dog
app.delete('/api/dogs/:id', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dog not found' });
  }

  dogs = dogs.filter(d => d.id !== req.params.id);
  res.status(204).send();
});

// Placeholder for upload dog photo
app.put('/api/dogs/:id/photo', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dog not found' });
  }

  // In development, just pretend we uploaded a photo
  dogs[index].image = `https://images.dog.ceo/breeds/retriever-golden/n02099601_${Math.floor(Math.random() * 9999)}.jpg`;
  res.json(dogs[index]);
});

// Placeholder for detect breed from photo
app.post('/api/dogs/:id/photo/detect-breed', verifyToken, (req, res) => {
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dog not found' });
  }

  // In development, just return a random breed
  const breeds = ['Golden Retriever', 'Labrador', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog'];
  dogs[index].breed = breeds[Math.floor(Math.random() * breeds.length)];

  res.json(dogs[index]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Local development server running at http://localhost:${PORT}`);
});