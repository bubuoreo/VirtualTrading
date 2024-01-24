// HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import Cookies from 'universal-cookie';

import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import CryptoItem from '../components/Crypto/CryptoItem.jsx';
import NewsItem from '../components/News/NewsItem.jsx';
import SpeedTestGauge from '../components/SentimentGauge/SpeedTestGauge.jsx';

import { update_user_action } from '../slices/userSlice.js';

const HomePage = ({ socket, handleSocketConnect }) => {

    var user = useSelector(state => state.userReducer.user);
    const dispatch = useDispatch();
    const cookies = new Cookies();
    const userToken = cookies.get('userToken');
    const [articles, setArticles] = useState([]);
    const [score, setScore] = useState(0); // Initialisez le score à 0

    const RetrieveUser = async (event) => {
        try {
            const userinfo = await fetch('http://localhost/user/' + String(userToken), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!userinfo.ok) {
                throw new Error(`Erreur HTTP! Statut : ${userinfo.status}`);
            }

            const userinfo1 = await userinfo.json();

            dispatch(update_user_action(userinfo1));
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        if (user.id) {
            console.log(user.id);
            handleSocketConnect(user.id);
        }
        RetrieveUser();
    }, [user.account]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost/articles');
                const data = await response.json();
                setArticles(data.articles.slice(0, 4));
                setScore(data.finalScore);
            } catch (error) {
                console.error('Erreur lors de la récupération des articles:', error);
            }
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('update_page', 'HOME');
        }
    }, [socket]);

    return (
        <Box>
            <Header />
            <Box className="bg-gray-200 min-h-screen">
                <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
                    <GridItem colSpan={8}>
                        <h1 className="text-4xl font-bold mt-8 mb-4">Crypto News</h1>
                        <NewsItem articles={articles} />
                    </GridItem>

                    <GridItem colSpan={4}>
                        <h1 className="text-4xl font-bold mt-8 mb-4">Fear & Greed</h1>
                        <SpeedTestGauge score={score} />
                    </GridItem>
                </Grid>

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
