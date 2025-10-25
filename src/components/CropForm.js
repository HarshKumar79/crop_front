import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Icon,
  Heading,
  Text,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { Sprout, Cloud, Droplets, TrendingUp, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { recommendCrops } from '../api';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

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
  const [focused, setFocused] = useState({});
  const [error, setError] = useState(null);
  const toast = useToast();

  const seasons = ['Kharif', 'Rabi', 'Whole Year', 'Summer', 'Winter', 'Autumn'];
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.Crop_Year || isNaN(formData.Crop_Year) || formData.Crop_Year < 1900 || formData.Crop_Year > 2100) {
      setError('Please enter a valid Crop Year (1900-2100).');
      return;
    }
    if (!formData.Season) {
      setError('Please select a Season.');
      return;
    }
    if (!formData.State) {
      setError('Please select a State.');
      return;
    }
    if (!formData.Area || formData.Area <= 0) {
      setError('Please enter a valid Area (greater than 0).');
      return;
    }
    if (!formData.Fertilizer || formData.Fertilizer < 0) {
      setError('Please enter a valid Fertilizer amount (non-negative).');
      return;
    }
    if (!formData.Pesticide || formData.Pesticide < 0) {
      setError('Please enter a valid Pesticide amount (non-negative).');
      return;
    }
    if (formData.Annual_Rainfall && formData.Annual_Rainfall < 0) {
      setError('Annual Rainfall must be non-negative.');
      return;
    }

    const data = {
      Crop_Year: parseInt(formData.Crop_Year),
      Season: formData.Season,
      State: formData.State,
      Area: parseFloat(formData.Area),
      Fertilizer: parseFloat(formData.Fertilizer),
      Pesticide: parseFloat(formData.Pesticide),
      Annual_Rainfall: formData.Annual_Rainfall ? parseFloat(formData.Annual_Rainfall) : null,
    };

    try {
      const recommendations = await recommendCrops(data);
      onRecommendations(recommendations);
      toast({
        title: 'Success',
        description: 'Crop recommendations fetched successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(`Error fetching recommendations: ${error.message}`);
      toast({
        title: 'Error',
        description: `Failed to fetch recommendations: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Animation variants for framer-motion
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 12px 24px rgba(46, 125, 50, 0.3)' },
    tap: { scale: 0.95 },
  };

  const cardVariants = {
    hover: { y: -4, boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)' },
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, green.50, green.200, green.300)"
      position="relative"
      overflow="hidden"
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {/* Animated Background Elements */}
      <Box position="absolute" inset={0} pointerEvents="none">
        <MotionBox
          position="absolute"
          top="40px"
          left="40px"
          color="green.300"
          opacity={0.15}
          animate={{ y: [-20, 0, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon as={Sprout} boxSize={120} />
        </MotionBox>
        <MotionBox
          position="absolute"
          top="160px"
          right="80px"
          color="green.400"
          opacity={0.15}
          animate={{ y: [-20, 0, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Icon as={Leaf} boxSize={100} />
        </MotionBox>
        <MotionBox
          position="absolute"
          bottom="80px"
          left="25%"
          color="green.500"
          opacity={0.15}
          animate={{ y: [-20, 0, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Icon as={Sprout} boxSize={90} />
        </MotionBox>
        <MotionBox
          position="absolute"
          bottom="160px"
          right="33%"
          color="green.300"
          opacity={0.15}
          animate={{ y: [-20, 0, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        >
          <Icon as={Cloud} boxSize={110} />
        </MotionBox>
        <MotionBox
          position="absolute"
          top="50%"
          right="40px"
          color="green.400"
          opacity={0.15}
          animate={{ y: [-20, 0, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <Icon as={Droplets} boxSize={80} />
        </MotionBox>
      </Box>

      {/* Main Content */}
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={12} position="relative" zIndex={10}>
        {/* Header */}
        <Box textAlign="center" mb={12}>
          <MotionBox
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            mb={6}
            bgGradient="linear(to-br, green.700, green.600)"
            p={5}
            borderRadius="full"
            boxShadow="0 8px 32px rgba(46, 125, 50, 0.3)"
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon as={TrendingUp} color="white" boxSize={14} />
          </MotionBox>
          <Heading
            as="h1"
            fontSize={{ base: '2.5rem', md: '4rem' }}
            fontWeight={800}
            bgGradient="linear(to-br, green.900, green.700, green.600)"
            bgClip="text"
            mb={4}
            letterSpacing="-2px"
          >
            Crop Prediction System
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="700px" mx="auto" lineHeight="1.6">
            Get intelligent crop recommendations based on your agricultural data
          </Text>
        </Box>

        {/* Form Card */}
        <Box maxW="900px" mx="auto">
          <MotionBox
            bg="whiteAlpha.900"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            boxShadow="0 24px 48px rgba(0, 0, 0, 0.12)"
            p={12}
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              {error && (
                <Box w="full" p={4} bg="red.50" borderRadius="md" color="red.700">
                  <Text>{error}</Text>
                </Box>
              )}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {/* Crop Year */}
                <FormControl isRequired isInvalid={focused.Crop_Year && !formData.Crop_Year}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Crop_Year || formData.Crop_Year ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Crop Year
                  </FormLabel>
                  <Input
                    type="number"
                    name="Crop_Year"
                    value={formData.Crop_Year}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Crop_Year')}
                    onBlur={() => handleBlur('Crop_Year')}
                    placeholder="e.g., 2025"
                    borderColor={focused.Crop_Year ? 'green.700' : 'gray.200'}
                    bg={focused.Crop_Year ? 'green.50' : 'white'}
                    boxShadow={focused.Crop_Year ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  />
                </FormControl>

                {/* Season */}
                <FormControl isRequired isInvalid={focused.Season && !formData.Season}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Season || formData.Season ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Season
                  </FormLabel>
                  <Select
                    name="Season"
                    value={formData.Season}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Season')}
                    onBlur={() => handleBlur('Season')}
                    placeholder="Select Season"
                    borderColor={focused.Season ? 'green.700' : 'gray.200'}
                    bg={focused.Season ? 'green.50' : 'white'}
                    boxShadow={focused.Season ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  >
                    {seasons.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* State */}
                <FormControl isRequired isInvalid={focused.State && !formData.State}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.State || formData.State ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    State
                  </FormLabel>
                  <Select
                    name="State"
                    value={formData.State}
                    onChange={handleChange}
                    onFocus={() => handleFocus('State')}
                    onBlur={() => handleBlur('State')}
                    placeholder="Select State"
                    borderColor={focused.State ? 'green.700' : 'gray.200'}
                    bg={focused.State ? 'green.50' : 'white'}
                    boxShadow={focused.State ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  >
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Area */}
                <FormControl isRequired isInvalid={focused.Area && !formData.Area}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Area || formData.Area ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Area (hectares)
                  </FormLabel>
                  <Input
                    type="number"
                    name="Area"
                    value={formData.Area}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Area')}
                    onBlur={() => handleBlur('Area')}
                    placeholder="e.g., 100"
                    step="0.01"
                    borderColor={focused.Area ? 'green.700' : 'gray.200'}
                    bg={focused.Area ? 'green.50' : 'white'}
                    boxShadow={focused.Area ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  />
                </FormControl>

                {/* Fertilizer */}
                <FormControl isRequired isInvalid={focused.Fertilizer && !formData.Fertilizer}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Fertilizer || formData.Fertilizer ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Fertilizer (kg)
                  </FormLabel>
                  <Input
                    type="number"
                    name="Fertilizer"
                    value={formData.Fertilizer}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Fertilizer')}
                    onBlur={() => handleBlur('Fertilizer')}
                    placeholder="e.g., 200"
                    step="0.01"
                    borderColor={focused.Fertilizer ? 'green.700' : 'gray.200'}
                    bg={focused.Fertilizer ? 'green.50' : 'white'}
                    boxShadow={focused.Fertilizer ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  />
                </FormControl>

                {/* Pesticide */}
                <FormControl isRequired isInvalid={focused.Pesticide && !formData.Pesticide}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Pesticide || formData.Pesticide ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Pesticide (kg)
                  </FormLabel>
                  <Input
                    type="number"
                    name="Pesticide"
                    value={formData.Pesticide}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Pesticide')}
                    onBlur={() => handleBlur('Pesticide')}
                    placeholder="e.g., 50"
                    step="0.01"
                    borderColor={focused.Pesticide ? 'green.700' : 'gray.200'}
                    bg={focused.Pesticide ? 'green.50' : 'white'}
                    boxShadow={focused.Pesticide ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  />
                </FormControl>

                {/* Annual Rainfall */}
                <FormControl gridColumn={{ base: 'span 1', lg: 'span 2' }}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                    color={focused.Annual_Rainfall || formData.Annual_Rainfall ? 'green.700' : 'gray.500'}
                    transition="color 0.3s ease"
                  >
                    Annual Rainfall (mm) - Optional
                  </FormLabel>
                  <Input
                    type="number"
                    name="Annual_Rainfall"
                    value={formData.Annual_Rainfall}
                    onChange={handleChange}
                    onFocus={() => handleFocus('Annual_Rainfall')}
                    onBlur={() => handleBlur('Annual_Rainfall')}
                    placeholder="e.g., 1200"
                    step="0.01"
                    borderColor={focused.Annual_Rainfall ? 'green.700' : 'gray.200'}
                    bg={focused.Annual_Rainfall ? 'green.50' : 'white'}
                    boxShadow={focused.Annual_Rainfall ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'}
                    borderRadius="md"
                    px={4}
                    py={6}
                    fontSize="md"
                    _hover={{ borderColor: 'green.500' }}
                    transition="all 0.3s ease"
                  />
                </FormControl>
              </SimpleGrid>

              {/* Submit Button */}
              <MotionButton
                type="submit"
                bgGradient="linear(to-br, green.700, green.600)"
                color="white"
                fontWeight="bold"
                fontSize="lg"
                py={6}
                px={8}
                borderRadius="md"
                boxShadow="0 8px 16px rgba(46, 125, 50, 0.2)"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                display="flex"
                alignItems="center"
                gap={3}
                textTransform="uppercase"
                letterSpacing="1px"
                w="full"
              >
                <Icon as={Sprout} boxSize={6} />
                Get Crop Recommendations
                <Icon as={TrendingUp} boxSize={6} />
              </MotionButton>
            </VStack>
          </MotionBox>

          {/* Info Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={12}>
            <MotionBox
              bg="whiteAlpha.900"
              borderRadius="lg"
              p={8}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
              variants={cardVariants}
              whileHover="hover"
              cursor="pointer"
            >
              <Box
                bgGradient="linear(to-br, green.100, green.200)"
                w="56px"
                h="56px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Icon as={Sprout} color="green.700" boxSize={7} />
              </Box>
              <Heading as="h3" fontSize="lg" fontWeight="bold" color="green.900" mb={2}>
                Smart Predictions
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                AI-powered recommendations for optimal crop selection
              </Text>
            </MotionBox>

            <MotionBox
              bg="whiteAlpha.900"
              borderRadius="lg"
              p={8}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
              variants={cardVariants}
              whileHover="hover"
              cursor="pointer"
            >
              <Box
                bgGradient="linear(to-br, teal.100, teal.200)"
                w="56px"
                h="56px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Icon as={Droplets} color="teal.700" boxSize={7} />
              </Box>
              <Heading as="h3" fontSize="lg" fontWeight="bold" color="green.900" mb={2}>
                Climate Analysis
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                Consider rainfall and seasonal patterns for best results
              </Text>
            </MotionBox>

            <MotionBox
              bg="whiteAlpha.900"
              borderRadius="lg"
              p={8}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
              variants={cardVariants}
              whileHover="hover"
              cursor="pointer"
            >
              <Box
                bgGradient="linear(to-br, lime.100, lime.200)"
                w="56px"
                h="56px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Icon as={TrendingUp} color="green.700" boxSize={7} />
              </Box>
              <Heading as="h3" fontSize="lg" fontWeight="bold" color="green.900" mb={2}>
                Maximize Yield
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                Optimize your harvest with data-driven insights
              </Text>
            </MotionBox>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default CropForm;