import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';

const CryptoCourbe = ({ cryptoSymbol, socket }) => {
    const cryptoData = useSelector((state) => state.cryptochartReducer.cryptochartData);
    const [timeframe, setTimeframe] = useState('1mo');
    const [chartData, setChartData] = useState([]);
    console.log(cryptoData);

    useEffect(() => {
        socket.emit('update_page', `${cryptoSymbol}/${timeframe}`);
    }, [cryptoSymbol, timeframe]);

    useEffect(() => {
        // Check if cryptoData is defined before updating chartData
        if (cryptoData && cryptoData[cryptoSymbol] && cryptoData[cryptoSymbol].quotes) {
            setChartData(cryptoData[cryptoSymbol].quotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
        }
    }, [cryptoData, cryptoSymbol]);

    const handleTimeframeClick = (newTimeframe) => {
        setTimeframe(newTimeframe);
    };

    return (
        <div>
            <h1>Crypto Chart</h1>
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
