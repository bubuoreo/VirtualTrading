// HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import CryptoItem from '../components/Crypto/CryptoItem.jsx';
import NewsItem2 from '../components/News/NewsItem2.jsx';
import SpeedTestGauge from '../components/SentimentGauge/SpeedTestGauge.jsx';
import { Box, Grid, GridItem } from '@chakra-ui/react';

const NewsPage = ({}) => {

    const [articles, setArticles] = useState([]);
    const [score, setScore] = useState(0); // Initialisez le score à 0

    useEffect(() => {
        const fetchArticles = async () => {
            try {
              const response = await fetch('http://localhost/articles');
              const data = await response.json();
              setArticles(data.articles.slice(0, 15));
              setScore(data.finalScore);
            } catch (error) {
              console.error('Erreur lors de la récupération des articles:', error);
            }
          };
      
          fetchArticles();
    }, []);

    return (
        <Box>
          <Header />
    
          {/* Indicateur de score en haut */}
          <Box p={4} bg="gray.200">
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={4}>
                <h1 className="text-4xl font-bold mt-8 mb-4">Fear & Greed</h1>
                <SpeedTestGauge score={score} />
              </GridItem>
            </Grid>
          </Box>
            <h1 className="text-4xl font-bold mt-8 mb-4">Crypto News</h1>
            <NewsItem2 articles={articles} />
          <Footer />
        </Box>
      );
};


export default NewsPage;
