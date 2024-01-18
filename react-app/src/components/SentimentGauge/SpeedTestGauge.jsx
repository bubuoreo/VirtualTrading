import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  ChakraProvider,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const SpeedTestGauge = () => {
  const [score, setScore] = useState(60);

  // Simule un changement de score toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const newScore = Math.random() * 100; // Remplacez par votre logique de récupération de score réel
      setScore(newScore);
    }, 2000);

    

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (score >= 60) {
      return 'green.500';
    } else if (score >= 40) {
      return 'yellow.500';
    } else if (score >= 20) {
      return 'orange.500';
    } else {
      return 'red.500';
    }
}

  return (
    <Box>
      {/* Jauge circulaire pour le score */}
      <ChakraProvider>
        <CircularProgress
          value={score}
          color={getColor()}
          size="200px"
          thickness="8px"
        >
          <CircularProgressLabel fontSize="2xl">
            {score.toFixed(2)} / 100
          </CircularProgressLabel>
        </CircularProgress>
      </ChakraProvider>

    </Box>
  );
};

export default SpeedTestGauge;
