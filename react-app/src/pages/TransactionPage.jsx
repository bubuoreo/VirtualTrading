// Importez les modules nécessaires de react-router-dom
import React from 'react';
import { Header } from '../components/Header/Header.jsx';
import CryptoItemTransaction from '../components/Crypto/CryptoItemTransaction.jsx';



const TransactionPage = () => {

    return (
        <div>
            <Header />
            <div>
                <h2>Transaction Page</h2>
                <CryptoItemTransaction />
            </div>
        </div>
    );
};

export default TransactionPage;