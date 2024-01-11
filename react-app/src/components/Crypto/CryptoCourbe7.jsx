// CryptoCourbe7.jsx
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoCourbe7 = ({ symbol }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/finance7j/${symbol}`);
        const data = await response.json();

        // Log the data received from the server
        console.log('Data received from server:', data);

        setChartData(data.quotes);
      } catch (error) {
        console.error("Error loading chart data: ", error);
      }
    };

    fetchData();
  }, [symbol]);

  // Check if chartData is not an array of objects
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return null;
  }

  // Calculate the minimum and maximum values from the chart data
  const minClose = Math.min(...chartData.map((quote) => quote.close));
  const maxClose = Math.max(...chartData.map((quote) => quote.close));
  const strokeColor = chartData[0].close > chartData[chartData.length - 1].close ? 'red' : 'green';
  // Set the domain to be centered around the data values
  const yDomain = [minClose - 10, maxClose + 10];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis dataKey="date" display="none" />
        <YAxis domain={[minClose, maxClose]} tick={false} display="none" />
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