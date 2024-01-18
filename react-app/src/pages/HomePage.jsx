// HomePage.jsx
import React, { useEffect } from 'react';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import CryptoItem from '../components/Crypto/CryptoItem.jsx';
import NewsItem from '../components/News/NewsItem.jsx';
import SpeedTestGauge from '../components/SentimentGauge/SpeedTestGauge.jsx';
import { Box, Grid, GridItem } from '@chakra-ui/react';

const HomePage = ({ socket, handleSocketConnect }) => {
    useEffect(() => {
        handleSocketConnect();
    }, []);
    useEffect(() => {

        // Émettre l'événement seulement si socket est défini
        if (socket) {
            socket.emit('update_page', 'HOME');
        }
    }, [socket]);

    return (
        <Box>
            <Header />
            <Box className="bg-gray-200 min-h-screen">
                <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
                    {/* Colonne des actualités (NewsItem) */}
                    <GridItem colSpan={8}>
                        <h1 className="text-4xl font-bold mt-8 mb-4">Crypto News</h1>
                        <NewsItem />
                    </GridItem>

                    {/* Colonne de la jauge (SpeedTestGauge) */}
                    <GridItem colSpan={4}>
                        <h1 className="text-4xl font-bold mt-8 mb-4">Fear & Greed</h1>
                        <SpeedTestGauge />
                    </GridItem>
                </Grid>

                {/* Section CryptoItem */}
                <div className="container mx-auto mt-8">
                    <h1 className="text-4xl font-bold mt-8 mb-4">Crypto Explorer</h1>
                    <CryptoItem />
                </div>
            </Box>

            <Footer />
        </Box>
    );
};


export default HomePage;
