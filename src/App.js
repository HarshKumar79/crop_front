import React, { useState } from 'react';
import { Box, Heading, Container } from '@chakra-ui/react';
import CropForm from './components/CropForm';
import RecommendationTable from './components/RecommendationTable';

function App() {
  const [recommendations, setRecommendations] = useState([]);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Crop Recommendation</Heading>
      <CropForm onRecommendations={setRecommendations} />
      <Box mt={8}>
        <RecommendationTable data={recommendations} />
      </Box>
    </Container>
  );
}

export default App;