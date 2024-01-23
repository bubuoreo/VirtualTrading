import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import CryptoScenario from '../components/Crypto/CryptoScenario.jsx';
import { Link, useNavigate } from 'react-router-dom'; // Utilisez useNavigate

const GamePage = ({ socket, result }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const navigate = useNavigate(); // Utilisez useNavigate au lieu de useHistory

  useEffect(() => {
    if (socket) {
      socket.emit('update_page', 'GAME');
    }
  }, [socket]);

  const navigateTomulti = () => {
    navigate('/crypto-chart-scenario/multi');
  }

  return (
    <div>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        {result && result.length > 0 ? (
          <div className="crypto-scenario-container">
            {result.map((item, index) => (
              <button key={index} onClick={() => navigate(`/crypto-chart-scenario/${index}`)}>
                <CryptoScenario id={index + 1} item={item} />
              </button>
            ))}
          </div>
        ) : (
          <p>Aucun résultat disponible</p>
        )}
        
        <button className="multi-button" onClick={navigateTomulti}>
          Multi-joueurs
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default GamePage;
