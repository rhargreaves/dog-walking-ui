import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DogList from './components/DogList';
import DogDetails from './components/DogDetails';
import DogForm from './components/DogForm';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<DogList />} />
          <Route path="/dogs/new" element={<DogForm />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/dogs/:id/edit" element={<DogForm />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
