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
  InputGroup,
  InputLeftElement,
  Container,
} from '@chakra-ui/react';
import { Sprout, Cloud, Droplets, TrendingUp, Leaf, MapPin, Calendar, Layers, FlaskConical, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field) => setFocused({ ...focused, [field]: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.Crop_Year || isNaN(formData.Crop_Year) || formData.Crop_Year < 1900 || formData.Crop_Year > 2100) {
      setError('Please enter a valid Crop Year (1900-2100).');
      return;
    }
    if (!formData.Season) return setError('Please select a Season.');
    if (!formData.State) return setError('Please select a State.');
    if (!formData.Area || formData.Area <= 0) return setError('Please enter a valid Area (greater than 0).');
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
        description: 'We have generated optimal crop recommendations for you.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      setError(`Error fetching recommendations: ${error.message}`);
      toast({
        title: 'Error',
        description: `Failed to fetch recommendations: ${error.message}`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Staggered Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
    hover: { y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)' },
  };

  // Helper component for styled inputs
  const StyledInput = ({ icon, label, name, placeholder, type = "text", step }) => (
    <FormControl isRequired={name !== 'Annual_Rainfall'} isInvalid={focused[name] && !formData[name] && name !== 'Annual_Rainfall'}>
      <FormLabel fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="widest" color={focused[name] ? 'green.600' : 'gray.500'} transition="color 0.3s ease" mb={3}>
        {label}
      </FormLabel>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none" h="full" pl={2}>
          <Icon as={icon} color={focused[name] ? 'green.500' : 'gray.400'} boxSize={5} transition="color 0.3s ease" />
        </InputLeftElement>
        <Input
          type={type}
          name={name}
          step={step}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => handleFocus(name)}
          onBlur={() => handleBlur(name)}
          placeholder={placeholder}
          bg="whiteAlpha.800"
          border="2px solid"
          borderColor="gray.100"
          borderRadius="xl"
          pl={12}
          h="60px"
          _hover={{ borderColor: 'green.200', bg: 'white' }}
          _focus={{ borderColor: 'green.500', bg: 'white', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
          transition="all 0.3s ease"
        />
      </InputGroup>
    </FormControl>
  );

  return (
    <Box minH="100vh" bg="#f2fcf5" position="relative" overflow="hidden" fontFamily="'Inter', system-ui, sans-serif">
      {/* Animated Abstract Background */}
      <Box position="absolute" inset={0} pointerEvents="none" zIndex={0} overflow="hidden">
        {/* Glowing Orbs */}
        <MotionBox
          position="absolute" top="-10%" left="-10%" w="50vw" h="50vw" borderRadius="full"
          bg="green.300" filter="blur(120px)" opacity={0.3}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <MotionBox
          position="absolute" bottom="-20%" right="-10%" w="60vw" h="60vw" borderRadius="full"
          bg="teal.200" filter="blur(150px)" opacity={0.25}
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Floating Icons */}
        <MotionBox position="absolute" top="15%" left="8%" color="green.400" opacity={0.2} animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon as={Sprout} boxSize={14} />
        </MotionBox>
        <MotionBox position="absolute" top="25%" right="12%" color="teal.400" opacity={0.2} animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon as={Leaf} boxSize={12} />
        </MotionBox>
        <MotionBox position="absolute" bottom="20%" left="15%" color="green.300" opacity={0.2} animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon as={Droplets} boxSize={16} />
        </MotionBox>
      </Box>

      <Container maxW="container.xl" py={{ base: 12, md: 20 }} position="relative" zIndex={10}>
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          
          {/* Header Section */}
          <MotionBox variants={itemVariants} textAlign="center" mb={16}>
            <Box display="inline-flex" alignItems="center" justifyContent="center" mb={6} p={4} bg="white" borderRadius="2xl" boxShadow="xl">
              <Box bgGradient="linear(to-r, green.400, teal.500)" p={3} borderRadius="xl">
                <Icon as={TrendingUp} color="white" boxSize={8} />
              </Box>
            </Box>
            <Heading as="h1" fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} fontWeight="900" letterSpacing="tight" mb={6}>
              Smart Crop <Text as="span" bgGradient="linear(to-r, green.500, teal.400)" bgClip="text">Prediction</Text>
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="2xl" mx="auto" lineHeight="tall">
              Leverage advanced AI to analyze your soil and climate data. Discover the most profitable and sustainable crops for your farm.
            </Text>
          </MotionBox>

          {/* Form and Info Section Layout */}
          <Box display="flex" flexDirection={{ base: 'column', xl: 'row' }} gap={12} alignItems="flex-start">
            
            {/* Main Form Card */}
            <MotionBox variants={itemVariants} flex="1" w="full">
              <Box bg="rgba(255, 255, 255, 0.85)" backdropFilter="blur(16px)" border="1px solid" borderColor="white" borderRadius="3xl" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.08)" p={{ base: 6, md: 10 }}>
                
                <AnimatePresence>
                  {error && (
                    <MotionBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} mb={6}>
                      <Box p={4} bg="red.50" borderLeft="4px solid" borderColor="red.500" borderRadius="md" color="red.700" display="flex" alignItems="center" gap={3}>
                        <Icon as={Cloud} color="red.500" />
                        <Text fontWeight="medium">{error}</Text>
                      </Box>
                    </MotionBox>
                  )}
                </AnimatePresence>

                <VStack spacing={8} as="form" onSubmit={handleSubmit}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
                    <StyledInput icon={Calendar} label="Crop Year" name="Crop_Year" placeholder="e.g., 2025" type="number" />
                    
                    <FormControl isRequired isInvalid={focused.Season && !formData.Season}>
                      <FormLabel fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="widest" color={focused.Season ? 'green.600' : 'gray.500'} mb={3}>Season</FormLabel>
                      <Select
                        name="Season" value={formData.Season} onChange={handleChange} onFocus={() => handleFocus('Season')} onBlur={() => handleBlur('Season')}
                        placeholder="Select Season" size="lg" h="60px" bg="whiteAlpha.800" border="2px solid" borderColor="gray.100" borderRadius="xl"
                        _hover={{ borderColor: 'green.200' }} _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                      >
                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </FormControl>

                    <FormControl isRequired isInvalid={focused.State && !formData.State}>
                      <FormLabel fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="widest" color={focused.State ? 'green.600' : 'gray.500'} mb={3}>State</FormLabel>
                      <Select
                        name="State" value={formData.State} onChange={handleChange} onFocus={() => handleFocus('State')} onBlur={() => handleBlur('State')}
                        placeholder="Select State" size="lg" h="60px" bg="whiteAlpha.800" border="2px solid" borderColor="gray.100" borderRadius="xl"
                        _hover={{ borderColor: 'green.200' }} _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                      >
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </FormControl>

                    <StyledInput icon={MapPin} label="Area (Hectares)" name="Area" placeholder="e.g., 100" type="number" step="0.01" />
                    <StyledInput icon={FlaskConical} label="Fertilizer (KG)" name="Fertilizer" placeholder="e.g., 200" type="number" step="0.01" />
                    <StyledInput icon={Bug} label="Pesticide (KG)" name="Pesticide" placeholder="e.g., 50" type="number" step="0.01" />
                  </SimpleGrid>

                  <Box w="full">
                    <StyledInput icon={Droplets} label="Annual Rainfall (MM) - Optional" name="Annual_Rainfall" placeholder="e.g., 1200" type="number" step="0.01" />
                  </Box>

                  <MotionButton
                    type="submit" size="lg" w="full" h="70px" bgGradient="linear(to-r, green.500, teal.500)" color="white"
                    fontWeight="bold" fontSize="lg" borderRadius="xl" boxShadow="0 10px 20px rgba(56, 178, 172, 0.3)"
                    whileHover={{ scale: 1.02, boxShadow: '0 15px 25px rgba(56, 178, 172, 0.4)' }}
                    whileTap={{ scale: 0.98 }} isLoading={isLoading} loadingText="Analyzing Data..."
                    rightIcon={<Icon as={TrendingUp} boxSize={6} />}
                  >
                    Generate Recommendations
                  </MotionButton>
                </VStack>
              </Box>
            </MotionBox>

            {/* Sidebar Info Cards */}
            <Box w={{ base: 'full', xl: '400px' }} display="flex" flexDirection={{ base: 'row', xl: 'column' }} gap={6} flexWrap="wrap">
              {[
                { title: 'Smart Analysis', desc: 'AI-powered models calculate the best crop yield based on historical patterns.', icon: Layers, color: 'blue' },
                { title: 'Climate Aware', desc: 'Takes localized weather and rainfall data into account for precise accuracy.', icon: Droplets, color: 'teal' },
                { title: 'Maximize ROI', desc: 'Optimize your fertilizer and area usage to ensure maximum profitability.', icon: TrendingUp, color: 'green' }
              ].map((feature, i) => (
                <MotionBox key={i} variants={cardVariants} whileHover="hover" flex={{ base: '1 1 300px', xl: 'none' }} bg="white" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                  <Box bg={`${feature.color}.50`} w="50px" h="50px" borderRadius="xl" display="flex" alignItems="center" justifyContent="center" mb={4}>
                    <Icon as={feature.icon} color={`${feature.color}.500`} boxSize={6} />
                  </Box>
                  <Heading as="h3" fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>{feature.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="tall">{feature.desc}</Text>
                </MotionBox>
              ))}
            </Box>

          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default CropForm;
