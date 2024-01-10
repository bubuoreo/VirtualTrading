// Importez les modules nécessaires de react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header/Header.jsx';
import CryptoItem from '../components/Crypto/CryptoItem.jsx';

const HomePage = () => {
    return (
        <div>
            
            <div className="bg-gray-200 min-h-screen">
                <div className="container mx-auto">
                <h1 className="text-4xl font-bold mt-8 mb-4 center"  style={{ marginLeft: '550px', marginTop: '20px' }}>Crypto Explorer</h1>
                <CryptoItem />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
