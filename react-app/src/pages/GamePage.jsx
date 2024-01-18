// HomePage.jsx
import React, { useEffect } from 'react';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';

const GamePage = ({ socket ,handleSocketConnect}) => { 

    return (
        <div>
            <Header />
            <div className="bg-gray-200 min-h-screen">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold mt-8 mb-4 center" style={{ marginLeft: '550px', marginTop: '20px' }}>Crypto News</h1>
                    <NewsItem />
                    <h1 className="text-4xl font-bold mt-8 mb-4 center" style={{ marginLeft: '550px', marginTop: '20px' }}>Crypto Explorer</h1>
                    <CryptoItem />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GamePage;
