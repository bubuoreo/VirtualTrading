import React from 'react';
import { Header } from '../components/Header/Header.jsx';
import CryptoItemTransactionBy from '../components/Crypto/CryptoItemTransactionBy.jsx';



const TransactionPageBy = () => {
    const { cryptoSymbol } = useParams();

    return (
        <div>
            <Header />
            <div>
                <h2>Transaction Page</h2>
                <CryptoItemTransactionBy />
            </div>
        </div>
    );
};

export default TransactionPageBy;