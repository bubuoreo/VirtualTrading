import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoCourbeMulti = ({ multiQuotes }) => {
    const [chartData, setChartData] = useState([]);
    

    useEffect(() => {
        if (multiQuotes) {
            console.log(multiQuotes);
            console.log(multiQuotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
            setChartData([...chartData, multiQuotes.map(q => ({ date: q.date.substring(0, 10), close: q.close }))]);
        }
    }, [multiQuotes]);

    const handleInvestClick = () => {
        
    };

    const handleWaitClick = () => {
        
    };
    
    const handleSellClick = () => {
        
    };

    return (
        <div>
            <h1>Crypto Chart</h1>
            <br />
            <ResponsiveContainer width="90%" height={400}>
                <LineChart data={chartData}>
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
