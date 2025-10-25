import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icon';
import { Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const RecommendationTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4} color="gray.500">
        No recommendations available. Please submit the form to get results.
      </Box>
    );
  }

  // Sort by probability descending (highest first)
  const sortedData = [...data].sort((a, b) => b.Probability - a.Probability);

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  // Rank emojis or text for top 3
  const rankLabels = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      bg="whiteAlpha.900"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      boxShadow="0 24px 48px rgba(0, 0, 0, 0.12)"
      p={{ base: 4, md: 6 }}
      mx="auto"
      maxW="900px"
    >
      <SimpleGrid columns={1} mb={6}>
        <Box display="flex" alignItems="center" gap={3}>
          <Icon as={Sprout} color="green.700" boxSize={8} />
          <Heading
            as="h2"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            bgGradient="linear(to-br, green.900, green.700)"
            bgClip="text"
          >
            Recommended Crops (Top 3)
          </Heading>
        </Box>
      </SimpleGrid>

      <Box overflowX="auto">
        <Table
          variant="striped"
          colorScheme="green"
          size={{ base: 'sm', md: 'md' }}
          aria-label="Crop recommendations table"
        >
          <Thead>
            <Tr>
              <Th
                fontSize={{ base: 'xs', md: 'sm' }}
                textTransform="uppercase"
                color="green.700"
                px={{ base: 2, md: 4 }}
              >
                Rank
              </Th>
              <Th
                fontSize={{ base: 'xs', md: 'sm' }}
                textTransform="uppercase"
                color="green.700"
                px={{ base: 2, md: 4 }}
              >
                Crop
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.slice(0, 3).map((item, index) => (
              <MotionTr
                key={index}
                variants={rowVariants}
                whileHover={{ bg: 'green.50', transition: { duration: 0.2 } }}
              >
                <Td px={{ base: 2, md: 4 }} fontSize={{ base: 'sm', md: 'md' }}>
                  {rankLabels[index] || `${index + 1}th`}
                </Td>
                <Td px={{ base: 2, md: 4 }} fontSize={{ base: 'sm', md: 'md' }}>
                  {item.Crop}
                </Td>
              </MotionTr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </MotionBox>
  );
};

export default RecommendationTable;
