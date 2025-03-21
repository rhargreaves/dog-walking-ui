import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DogList from './components/DogList';
import DogDetails from './components/DogDetails';
import DogForm from './components/DogForm';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import configureAmplify from './aws-config';

// Configure AWS Amplify for authentication
configureAmplify();

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DogList />} />
              <Route path="/dogs/new" element={<DogForm />} />
              <Route path="/dogs/:id" element={<DogDetails />} />
              <Route path="/dogs/:id/edit" element={<DogForm />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
