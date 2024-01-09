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
                    <h1 className="text-4xl font-bold mt-8 mb-4">Crypto Details</h1>
                    {/* Utilisez le composant Link pour créer un lien vers la CryptoDetailsPage */}
                    <Link to="/crypto-details">
                        <CryptoItem />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
