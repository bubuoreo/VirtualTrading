import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import CryptoDetailsPage from './pages/CryptoDetailsPage.jsx';
import PersonalWalletPage from './pages/PersonalWalletPage.jsx';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { update_crypto_data } from '../src/slices/cryptoSlice'; 
import { update_crypto_info } from '../src/slices/cryptodataSlice';  
import { update_crypto_chart } from '../src/slices/cryptochartSlice.js';  
import TransactionPage from './pages/TransactionPage.jsx';
import TransactionPageBy from './pages/TransactionPageBy.jsx';


export const App = () => {
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
  const user = useSelector((state) => state.userReducer.user);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', { query: { id: user.id } });
    setSocketsListeners(socketRef.current);


    return () => {
      if (socketRef.current) {  
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setSocketsListeners = (socket) => {
    socket.on('/finance7j', function (data) {
      const result = JSON.parse(data);
      const code = result.meta.symbol;
      dispatch(update_crypto_data({ code, data: result.quotes }));
      
    });

    socket.on('/finance', function (data) {
      const result = JSON.parse(data);
      const symbol = result.symbol;
      console.log(result)
      dispatch(update_crypto_info({ symbol, data: result }));
    });

    socket.on('/financeChart', function (data) {
      const result = JSON.parse(data);
      
      dispatch(update_crypto_chart(result));
    });
  };
  return (
    <Router>
      <Routes>
        {/* Définissez la page d'accueil comme composant pour le chemin "/" */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<HomePage socket={socketRef.current}/>} />
        <Route path="/crypto-details/:cryptoSymbol" element={<CryptoDetailsPage socket={socketRef.current}/>} />
        <Route path="/wallet" element={<PersonalWalletPage  socket={socketRef.current} />}/>
        <Route path="/transactions/:cryptoSymbol" element={<TransactionPageBy />} />
        <Route path="/transactions" element={<TransactionPage />} />
        {/* Ajoutez d'autres routes au besoin */}
      </Routes>
    </Router>
  );
};

export default App;
