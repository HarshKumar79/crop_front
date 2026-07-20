import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { Sprout, Trophy, Medal, Leaf, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const RecommendationTable = ({ data }) => {
  // 1. Elegant Empty State
  if (!data || data.length === 0) {
    return (
      <Box
        w="full"
        maxW="800px"
        mx="auto"
        p={10}
        bg="gray.50"
        borderRadius="2xl"
        border="2px dashed"
        borderColor="gray.200"
        textAlign="center"
      >
        <Flex justify="center" mb={4}>
          <Flex align="center" justify="center" w={16} h={16} bg="white" borderRadius="full" boxShadow="sm">
            <Icon as={Sprout} boxSize={8} color="gray.400" />
          </Flex>
        </Flex>
        <Heading as="h3" fontSize="lg" color="gray.600" fontWeight="600" mb={2}>
          No Recommendations Yet
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Fill out the field parameters and run the model to see optimal crops.
        </Text>
      </Box>
    );
  }

  // 2. Sort by probability descending (highest first)
  const sortedData = [...data].sort((a, b) => (b.Probability || 0) - (a.Probability || 0));
  const topCrops = sortedData.slice(0, 3);

  // 3. Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  // Rank metadata for beautiful icons/colors
  const rankStyles = [
    {
      icon: Trophy,
      iconColor: 'yellow.500',
      bg: 'yellow.50',
      border: 'yellow.200',
      label: 'Optimal Choice',
      badgeColor: 'yellow',
    },
    {
      icon: Medal,
      iconColor: 'gray.400',
      bg: 'white',
      border: 'gray.100',
      label: 'Strong Alternative',
      badgeColor: 'gray',
    },
    {
      icon: Leaf,
      iconColor: 'orange.400',
      bg: 'white',
      border: 'gray.100',
      label: 'Viable Option',
      badgeColor: 'orange',
    },
  ];

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      bg="white"
      borderRadius="2xl"
      boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 6, md: 10 }}
      mx="auto"
      maxW="800px"
      w="full"
      fontFamily="'Inter', sans-serif"
    >
      <Box mb={8} borderBottom="1px solid" borderColor="gray.100" pb={6}>
        <Flex align="center" gap={3} mb={2}>
          <Flex align="center" justify="center" p={2} bg="green.50" borderRadius="md">
            <Icon as={Sprout} color="green.600" boxSize={6} />
          </Flex>
          <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.900">
            Intelligent Yield Results
          </Heading>
        </Flex>
        <Text color="gray.500" fontSize="sm">
          Based on your localized parameters, here are the top 3 crops predicted to maximize your return.
        </Text>
      </Box>

      <VStack spacing={4} align="stretch">
        {topCrops.map((item, index) => {
          const style = rankStyles[index];
          const isFirst = index === 0;

          return (
            <MotionFlex
              key={index}
              variants={cardVariants}
              whileHover={{ y: -2, boxShadow: '0 8px 20px -8px rgba(0,0,0,0.1)' }}
              bg={style.bg}
              border="1px solid"
              borderColor={style.border}
              borderRadius="xl"
              p={isFirst ? 6 : 5}
              align="center"
              justify="space-between"
              position="relative"
              overflow="hidden"
              transition="all 0.2s"
            >
              {/* Subtle side highlight for 1st place */}
              {isFirst && (
                <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg="yellow.400" />
              )}

              <Flex align="center" gap={isFirst ? 5 : 4}>
                <Flex
                  align="center"
                  justify="center"
                  w={isFirst ? 14 : 12}
                  h={isFirst ? 14 : 12}
                  bg="white"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={style.border}
                  boxShadow="sm"
                >
                  <Icon as={style.icon} color={style.iconColor} boxSize={isFirst ? 7 : 5} />
                </Flex>

                <Box>
                  <Flex align="center" gap={3} mb={1}>
                    <Text
                      fontSize={isFirst ? '2xl' : 'lg'}
                      fontWeight="700"
                      color="gray.900"
                      textTransform="capitalize"
                    >
                      {item.Crop}
                    </Text>
                    {isFirst && (
                      <Badge colorScheme={style.badgeColor} px={2} py={0.5} borderRadius="md" textTransform="uppercase" fontSize="2xs" fontWeight="700">
                        #1 Match
                      </Badge>
                    )}
                  </Flex>
                  <Text color="gray.500" fontSize="sm" fontWeight="500">
                    {style.label}
                  </Text>
                </Box>
              </Flex>

              {/* Only show probability if it exists in your API response */}
              {item.Probability !== undefined && (
                <Box textAlign="right">
                  <Text fontSize="xs" color="gray.400" textTransform="uppercase" fontWeight="600" mb={1}>
                    Confidence
                  </Text>
                  <Text fontSize={isFirst ? 'xl' : 'md'} fontWeight="700" color="green.600">
                    {/* Formats decimal probability to percentage (e.g., 0.95 -> 95%) */}
                    {item.Probability > 1 
                      ? `${item.Probability.toFixed(1)}%` 
                      : `${(item.Probability * 100).toFixed(1)}%`}
                  </Text>
                </Box>
              )}
            </MotionFlex>
          );
        })}
      </VStack>

      <Flex mt={8} p={4} bg="gray.50" borderRadius="lg" align="center" gap={3}>
        <Icon as={AlertCircle} color="gray.400" boxSize={5} />
        <Text fontSize="xs" color="gray.500" lineHeight="tall">
          <strong>Disclaimer:</strong> Predictions are generated using historical agricultural machine learning models. Always consult with a local agronomist before making major planting decisions.
        </Text>
      </Flex>
    </MotionBox>
  );
};

export default RecommendationTable;
