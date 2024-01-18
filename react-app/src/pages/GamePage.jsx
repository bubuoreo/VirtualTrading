import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import CryptoScenario from '../components/Crypto/CryptoScenario.jsx';

const GamePage = ({ socket, result }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit('update_page', 'GAME');
    }
  }, [socket]);

  const handleScenarioClick = (id) => {
    setSelectedScenario(id);
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        {result && result.length > 0 ? (
          <div className="crypto-scenario-container">
            {result.map((item, index) => (
              <CryptoScenario
                key={index}
                id={index + 1}
                onClick={() => handleScenarioClick(index + 1)}
              />
            ))}
          </div>
        ) : (
          <p>Aucun résultat disponible</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GamePage;
