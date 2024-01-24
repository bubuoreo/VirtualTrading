import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@chakra-ui/react';
const CryptoCourbeScenario = ({ cryptoinfo }) => {
    const cryptoData = cryptoinfo;
    const [chartData, setChartData] = useState([]);
    const [showFullChart, setShowFullChart] = useState(false);
    const [decision, setDecision] = useState(null);

    useEffect(() => {
        if (cryptoData && cryptoData.quotes) {
            setChartData(cryptoData.quotes.map(q => ({ date: q.date.substring(0, 10), close: q.close })));
        }
    }, [cryptoData]);

    const handleInvestClick = () => {
        setShowFullChart(true);
        if (chartData.length > 0) {
            const decemberClose = chartData[chartData.length - 1].close;
            const juneClose = chartData[5].close; // 5 represents June in your example
            if (decemberClose > juneClose) {
                setDecision("Gagné");
            } else {
                setDecision("Perdu");
            }
        }
    };

    const handleWaitClick = () => {
        setShowFullChart(true);
        if (chartData.length > 0) {
            const decemberClose = chartData[chartData.length - 1].close;
            const juneClose = chartData[5].close; // 5 represents June in your example
            if (decemberClose < juneClose) {
                setDecision("Gagné");
            } else {
                setDecision("Perdu");
            }
        }
    };

    return (
        <div>
            <h1>Crypto Chart</h1>
            <br />
            <ResponsiveContainer width="90%" height={400}>
                <LineChart data={showFullChart ? chartData : chartData.slice(0, 6)}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="close" stroke="#82ca9d" name={`${cryptoData.meta.symbol} Price`} />
                </LineChart>
            </ResponsiveContainer>
            <div>
            <Button colorScheme="green" onClick={handleInvestClick}>
                            Buy
                        </Button>
            <Button colorScheme="red" onClick={handleWaitClick}>
                            Wait
                        </Button>

            </div>
            {decision && <p>Vous avez {decision}</p>}
        </div>
    );
};

export default CryptoCourbeScenario;
