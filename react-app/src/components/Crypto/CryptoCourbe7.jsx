import React from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoCourbe7 = ({ symbol }) => {
  const cryptoData = useSelector((state) => state.cryptoReducer.cryptoData);

  if (!cryptoData || !cryptoData[symbol] || cryptoData[symbol].length === 0) {
    return null;
  }

  const chartData = cryptoData[symbol];

  const minClose = Math.min(...chartData.map((quote) => quote.low));
  const maxClose = Math.max(...chartData.map((quote) => quote.high));
  const strokeColor = chartData[0].close > chartData[chartData.length - 1].close ? 'red' : 'green';
  const yDomain = [minClose - 2, maxClose + 2];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey="date" display="none" />
        <YAxis domain={[minClose, maxClose]} tick={false} display="none"  />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="close"
          name={`${symbol} Price`}
          stroke={strokeColor}
          fill={`rgba(${strokeColor === 'red' ? '255, 0, 0' : '0, 255, 0'}, 0.2)`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CryptoCourbe7;
