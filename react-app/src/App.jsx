import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import CryptoDetailsPage from './pages/CryptoDetailsPage.jsx';
import PersonalWalletPage from './pages/PersonalWalletPage.jsx';

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Définissez la page d'accueil comme composant pour le chemin "/" */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/crypto-details/:cryptoSymbol" element={<CryptoDetailsPage />} />
        <Route path="/wallet" element={<PersonalWalletPage />} />
        {/* Ajoutez d'autres routes au besoin */}
      </Routes>
    </Router>
  );
};

export default App;
