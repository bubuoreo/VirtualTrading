import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoCourbeMulti = ({ multiQuotes }) => {
    const multiQuotes = cryptoinfo;
    const [chartData, setChartData] = useState([]);
    const [showFullChart, setShowFullChart] = useState(false);

    useEffect(() => {
        if (multiQuotes) {
            setChartData(multiQuotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
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
                <LineChart data={showFullChart ? chartData : chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CryptoCourbeMulti;
