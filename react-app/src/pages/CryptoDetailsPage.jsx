import React from 'react';
import CryptoItem from '../components/Crypto/CryptoItem';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';

const CryptoDetailsPage = () => {
return (
    <div className="bg-gray-200 min-h-screen">
        <div className="container mx-auto">
        <div> <CryptoCourbe /> </div>
        <h1 className="text-4xl font-bold mt-8 mb-4">Crypto Details</h1>
        <CryptoItem />
        </div>
    </div>
    );
};

export default CryptoDetailsPage;