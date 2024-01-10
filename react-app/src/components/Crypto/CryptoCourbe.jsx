import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@chakra-ui/react';

const CryptoCourbe = ({ cryptoSymbol }) => {
    const [timeframe, setTimeframe] = useState('1mo');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [cryptoSymbol, timeframe]);

    const fetchData = () => {
        fetch(`http://localhost:3000/finance/${cryptoSymbol}/${timeframe}`)
            .then(response => response.json())
            .then(data => {
                setChartData(data.quotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
            })
            .catch(err => console.error("Error loading chart data: ", err));
    };

    const updateSymbol = (newSymbol) => {
        // Mise à jour du symbole de la crypto-monnaie
        fetchData();
        updatePrice(newSymbol);
    };

    const updatePrice = (assetSymbol) => {
        fetch(`http://localhost:3000/finance/${assetSymbol}`)
            .then(response => response.json())
            .then(data => {
                const priceFormatted = Number(data.regularMarketPrice).toFixed(2);
                // Mettez à jour la logique d'affichage du prix ici
            })
            .catch(err => console.error("Error loading data: ", err));
    };

    const handleTimeframeClick = (newTimeframe) => {
        setTimeframe(newTimeframe);
    };

    return (
        <div>
            <h1>Crypto Chart</h1>

            <Button onClick={() => updateSymbol('BTC-USD')} variant="futuristic">BTC</Button>
            <Button onClick={() => updateSymbol('ETH-USD')} variant="futuristic">ETH</Button>
            <Button onClick={() => updateSymbol('CHZ-USD')} variant="futuristic">CHZ</Button>

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
                    <Line type="monotone" dataKey="close" stroke="#82ca9d" name={`${cryptoSymbol} Price`} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CryptoCourbe;
