import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoItem from '../components/Crypto/CryptoItem';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';

const CryptoDetailsPage = () => {
    // Utilisez useParams pour récupérer les paramètres de l'URL
    const { cryptoSymbol } = useParams();

    return (
        <div className="bg-gray-200 min-h-screen">
            <div className="container mx-auto">
                <div> <CryptoCourbe cryptoSymbol={cryptoSymbol} /> </div>
                <h1 className="text-4xl font-bold mt-8 mb-4">Crypto Details</h1>
                <CryptoItem />
            </div>
        </div>
    );
};

export default CryptoDetailsPage;
