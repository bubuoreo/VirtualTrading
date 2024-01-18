import React, { useState, useEffect } from 'react';

const CryptoScenario = ({ id,socket }) => {
  const [cryptoSymbol, setCryptoSymbol] = useState('');

  useEffect(() => {
    if (socket) {
        socket.emit('update_page', 'GAME');
    }}, [socket]);


  return (
    <div className="crypto-scenario">
      <p>Scénario {id} avec Crypto étudié : {cryptoSymbol}</p>
    </div>
  );
};

export default CryptoScenario;
