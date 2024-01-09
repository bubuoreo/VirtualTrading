import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoCourbe = () => {
  const [symbol, setSymbol] = useState('BTC-USD');
  const [timeframe, setTimeframe] = useState('1mo');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [symbol, timeframe]);

  const fetchData = () => {
    fetch(`http://localhost:3000/finance/${symbol}/${timeframe}`)
      .then(response => response.json())
      .then(data => {
        setChartData(data.quotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
      })
      .catch(err => console.error("Error loading chart data: ", err));
  };

  const updateSymbol = (newSymbol) => {
    setSymbol(newSymbol);
    fetchData();
    updatePrice(newSymbol);
  };

  const updatePrice = (assetSymbol) => {
    fetch(`http://localhost:3000/finance/${assetSymbol}`)
      .then(response => response.json())
      .then(data => {
        const priceFormatted = Number(data.regularMarketPrice).toFixed(2);
        // Update the price display logic here
      })
      .catch(err => console.error("Error loading data: ", err));
  };

  const handleTimeframeClick = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div>
      <h1>Crypto Chart</h1>

      <button onClick={() => updateSymbol('BTC-USD')}>BTC</button>
      <button onClick={() => updateSymbol('ETH-USD')}>ETH</button>
      <button onClick={() => updateSymbol('CHZ-USD')}>CHZ</button>

      <br />

      <button onClick={() => handleTimeframeClick('1d')}>Day</button>
      <button onClick={() => handleTimeframeClick('1wk')}>Week</button>
      <button onClick={() => handleTimeframeClick('1mo')}>Month</button>

      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#82ca9d" name={`${symbol} Price`} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoCourbe;