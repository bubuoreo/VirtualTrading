import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbeScenario from '../components/Crypto/CryptoCourbeScenario';
import { Header } from '../components/Header/Header';
const CryptoChartScenario = ({ result }) => {
  const { cryptoSymbol } = useParams();
  const { scenarioId } = useParams();

  const scenarioData = result && result.length > scenarioId ? result[scenarioId] : null;

  return (
    <div>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        <div className="container mx-auto">
          <CryptoCourbeScenario cryptoinfo={scenarioData} />
        </div>
      </div>
    </div>
  );
};

export default CryptoChartScenario;
