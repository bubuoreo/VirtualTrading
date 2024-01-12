// Importez les modules nécessaires de react-router-dom
import React from 'react';
import { Header } from '../components/Header/Header.jsx';
import CryptoItemPersonal from '../components/Crypto/CryptoItemPersonal.jsx';

const PersonalWalletPage = () => {

    
    return (
        <div>
            <Header />
            <div>
                <h2>Your Personal Wallet</h2>
                    <CryptoItemPersonal />
            </div>
        </div>
    );
};

export default PersonalWalletPage;
