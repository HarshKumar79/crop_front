import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading,
  Text,
  SimpleGrid,
  useToast,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Sprout, MapPin, Calendar, CloudRain, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendCrops } from '../api';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const CropForm = ({ onRecommendations }) => {
  const [formData, setFormData] = useState({
    Crop_Year: '',
    Season: '',
    State: '',
    Area: '',
    Fertilizer: '',
    Pesticide: '',
    Annual_Rainfall: '',
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const seasons = ['Kharif', 'Rabi', 'Whole Year', 'Summer', 'Winter', 'Autumn'];
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  // Fixed handleChange: State updates smoothly without unmounting inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.Crop_Year || isNaN(formData.Crop_Year) || formData.Crop_Year < 1900 || formData.Crop_Year > 2100) {
      return setError('Please enter a valid Crop Year (e.g., 2024).');
    }
    if (!formData.Season) return setError('Please select a Season.');
    if (!formData.State) return setError('Please select a State.');
    if (!formData.Area || formData.Area <= 0) return setError('Please enter a valid Area greater than 0.');
    if (!formData.Fertilizer || formData.Fertilizer < 0) return setError('Please enter a valid Fertilizer amount.');
    if (!formData.Pesticide || formData.Pesticide < 0) return setError('Please enter a valid Pesticide amount.');
    if (formData.Annual_Rainfall && formData.Annual_Rainfall < 0) return setError('Annual Rainfall must be non-negative.');

    const data = {
      Crop_Year: parseInt(formData.Crop_Year),
      Season: formData.Season,
      State: formData.State,
      Area: parseFloat(formData.Area),
      Fertilizer: parseFloat(formData.Fertilizer),
      Pesticide: parseFloat(formData.Pesticide),
      Annual_Rainfall: formData.Annual_Rainfall ? parseFloat(formData.Annual_Rainfall) : null,
    };

    setIsLoading(true);
    try {
      const recommendations = await recommendCrops(data);
      onRecommendations(recommendations);
      toast({
        title: 'Analysis Complete',
        description: 'Optimal crops generated successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      setError(`Failed to fetch recommendations: ${error.message}`);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: 'column', lg: 'row' }} bg="white" fontFamily="'Inter', sans-serif">
      
      {/* LEFT PANEL - Elegant Dark Section */}
      <MotionFlex
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        w={{ base: '100%', lg: '40%' }}
        bg="gray.900"
        color="white"
        p={{ base: 10, lg: 20 }}
        direction="column"
        justify="space-between"
        position="relative"
        overflow="hidden"
      >
        {/* Abstract Background Element */}
        <Box position="absolute" top="-10%" left="-20%" w="500px" h="500px" bg="whiteAlpha.100" borderRadius="full" filter="blur(100px)" pointerEvents="none" />

        <Box zIndex={1}>
          <Icon as={Sprout} boxSize={10} color="gray.300" mb={8} />
          <Heading as="h1" fontSize={{ base: '4xl', lg: '5xl' }} fontWeight="300" letterSpacing="tight" lineHeight="1.2" mb={6}>
            Predict your <br />
            <Text as="span" fontWeight="700" color="white">harvest trajectory.</Text>
          </Heading>
          <Text fontSize="lg" color="gray.400" maxW="md" lineHeight="1.6">
            Input your localized soil, climate, and geographic data to let our intelligence engine determine the highest-yield crops for your specific conditions.
          </Text>
        </Box>

        <VStack align="start" spacing={6} mt={{ base: 12, lg: 0 }} zIndex={1}>
          <Flex align="center" gap={4}>
            <Flex align="center" justify="center" w={10} h={10} bg="whiteAlpha.100" borderRadius="md">
              <Icon as={Activity} color="white" />
            </Flex>
            <Box>
              <Text fontWeight="600" fontSize="sm">Data-Driven Insights</Text>
              <Text fontSize="sm" color="gray.400">Backed by historical agricultural trends.</Text>
            </Box>
          </Flex>
          <Flex align="center" gap={4}>
            <Flex align="center" justify="center" w={10} h={10} bg="whiteAlpha.100" borderRadius="md">
              <Icon as={MapPin} color="white" />
            </Flex>
            <Box>
              <Text fontWeight="600" fontSize="sm">Hyper-Localized</Text>
              <Text fontSize="sm" color="gray.400">Tailored exactly to your region and season.</Text>
            </Box>
          </Flex>
        </VStack>
      </MotionFlex>

      {/* RIGHT PANEL - Clean Minimalist Form */}
      <Flex
        w={{ base: '100%', lg: '60%' }}
        bg="gray.50"
        p={{ base: 6, md: 12, lg: 20 }}
        align="center"
        justify="center"
      >
        <Box w="full" maxW="800px">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            bg="white"
            p={{ base: 8, md: 12 }}
            borderRadius="2xl"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box mb={10}>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.900" mb={2}>
                System Parameters
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Fill in the required fields below to run the prediction model.
              </Text>
            </Box>

            <AnimatePresence>
              {error && (
                <MotionBox
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 24 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  overflow="hidden"
                >
                  <Flex p={4} bg="red.50" color="red.700" borderRadius="lg" align="center" gap={3} border="1px solid" borderColor="red.100">
                    <Icon as={ShieldAlert} boxSize={5} />
                    <Text fontSize="sm" fontWeight="500">{error}</Text>
                  </Flex>
                </MotionBox>
              )}
            </AnimatePresence>

            <VStack spacing={8} as="form" onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                
                {/* Crop Year */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    Crop Year
                  </FormLabel>
                  <Input
                    type="number" name="Crop_Year" value={formData.Crop_Year} onChange={handleChange}
                    placeholder="e.g., 2024" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  />
                </FormControl>

                {/* Season */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    Season
                  </FormLabel>
                  <Select
                    name="Season" value={formData.Season} onChange={handleChange}
                    placeholder="Select Season" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  >
                    {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </FormControl>

                {/* State */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    State Location
                  </FormLabel>
                  <Select
                    name="State" value={formData.State} onChange={handleChange}
                    placeholder="Select State" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  >
                    {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </FormControl>

                {/* Area */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    Area (Hectares)
                  </FormLabel>
                  <Input
                    type="number" step="0.01" name="Area" value={formData.Area} onChange={handleChange}
                    placeholder="0.00" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  />
                </FormControl>

                {/* Fertilizer */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    Fertilizer (KG)
                  </FormLabel>
                  <Input
                    type="number" step="0.01" name="Fertilizer" value={formData.Fertilizer} onChange={handleChange}
                    placeholder="0.00" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  />
                </FormControl>

                {/* Pesticide */}
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                    Pesticide (KG)
                  </FormLabel>
                  <Input
                    type="number" step="0.01" name="Pesticide" value={formData.Pesticide} onChange={handleChange}
                    placeholder="0.00" size="lg" fontSize="md"
                    bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                    _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Annual Rainfall - Full Width */}
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                  Annual Rainfall (MM) <Text as="span" color="gray.400" textTransform="none">— Optional</Text>
                </FormLabel>
                <Input
                  type="number" step="0.01" name="Annual_Rainfall" value={formData.Annual_Rainfall} onChange={handleChange}
                  placeholder="e.g., 1200" size="lg" fontSize="md"
                  bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg"
                  _hover={{ borderColor: 'gray.300' }} _focus={{ bg: 'white', borderColor: 'gray.900', boxShadow: 'none' }}
                />
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                w="full"
                size="lg"
                h={14}
                bg="gray.900"
                color="white"
                fontSize="md"
                fontWeight="600"
                borderRadius="lg"
                isLoading={isLoading}
                loadingText="Running Analysis..."
                rightIcon={<Icon as={ArrowRight} boxSize={5} />}
                _hover={{ bg: 'gray.800', transform: 'translateY(-1px)', boxShadow: 'lg' }}
                _active={{ bg: 'black', transform: 'translateY(0)' }}
                transition="all 0.2s"
                mt={4}
              >
                Run Prediction Model
              </Button>
            </VStack>
          </MotionBox>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CropForm;
