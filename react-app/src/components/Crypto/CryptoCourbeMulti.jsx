import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoCourbeMulti = ({ multiQuotes }) => {
    const [chartData, setChartData] = useState([]);
    const [cumulativeData, setCumulativeData] = useState([]);

    useEffect(() => {
        if (multiQuotes) {
            console.log(multiQuotes);
            const newChartData = multiQuotes.map(q => ({ date: q.date.substring(0, 10), close: q.close }));
            setChartData(newChartData);

            // Update cumulativeData by concatenating the new data to the existing data
            setCumulativeData(prevData => [...prevData, ...newChartData]);
        }
    }, [multiQuotes]);

    const handleInvestClick = () => {
        // Handle invest click
    };

    const handleWaitClick = () => {
        // Handle wait click
    };

    const handleSellClick = () => {
        // Handle sell click
    };

    return (
        <div>
            <h1>Crypto Chart</h1>
            <br />
            <ResponsiveContainer width="90%" height={400}>
                <LineChart data={cumulativeData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="close" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CryptoCourbeMulti;
