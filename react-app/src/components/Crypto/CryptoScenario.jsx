import React from 'react';

const CryptoScenario = ({ id, onClick }) => {
  const cryptoScenarioStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '150px', // Largeur du rectangle
    height: '80px', // Hauteur du rectangle
    border: '2px solid #333', // Bordure du rectangle
    borderRadius: '8px', // Coins arrondis
    cursor: 'pointer', // Curseur de la souris en forme de main lors du survol
  };

  return (
    <div className="crypto-scenario" style={cryptoScenarioStyle} onClick={onClick}>
      Scénario {id}
    </div>
  );
};

export default CryptoScenario;
