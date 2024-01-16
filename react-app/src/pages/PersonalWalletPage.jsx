// Importez les modules nécessaires de react-router-dom
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/Header/Header.jsx';
import CryptoItemPersonal from '../components/Crypto/CryptoItemPersonal.jsx';
import CryptoDonought from '../components/Crypto/CryptoDonought.jsx';


const PersonalWalletPage = () => {
  const dispatch = useDispatch();
  let user = useSelector(state => state.userReducer.user);
  const [cryptos, setCryptos] = useState([]);
  const [amounts, setAmounts] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const transacinfo = await fetch('http://localhost:8080/asset/user/' + String(user.id), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!transacinfo.ok) {
          throw new Error(`Erreur HTTP! Statut : ${transacinfo.status}`);
        }

        const transacinfo1 = await transacinfo.json();
        console.log(transacinfo1);

        // Extraction des données nécessaires et mise à jour des états
        const cryptoSymbols = transacinfo1.map(item => item.symbol);
        const cryptoAmounts = transacinfo1.map(item => item.assetQuantity);

        setCryptos(cryptoSymbols);
        setAmounts(cryptoAmounts);
      } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
      }
    };

    fetchData();
  }, [dispatch, user.id]);

  return (
    <div>
      <Header />
      <div>
        <h2>Your Personal Wallet</h2>
        <CryptoDonought cryptos={cryptos} amounts={amounts} />
        <CryptoItemPersonal cryptos={cryptos} amounts={amounts} />
      </div>
    </div>
  );
};

export default PersonalWalletPage;