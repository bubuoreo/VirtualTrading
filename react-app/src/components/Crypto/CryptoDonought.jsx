import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
const CryptoDonought = ({ cryptos, amounts }) => {
    const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);

    const [tableData, setTableData] = useState([]);


    const calculateUSDAmount = (amount, cryptoPrice) => {
        return (parseFloat((amount * cryptoPrice).toFixed(2))); // Fixer à 8 décimales pour Bitcoin
    };

    const data = cryptos.map((crypto, index) => ({
        name: crypto,
        value: calculateUSDAmount(amounts[index], parseFloat(tableData.find(item => item.crypto === crypto)?.close))
    }));




    useEffect(() => {
    

                const newData = cryptos.map(crypto => {
                        const cryptoInfo = cryptoinfoData[crypto];
                        return {
                            crypto,
                            close: cryptoInfo.regularMarketPrice.toFixed(2),
                        };
                    });
                

                setTableData(newData);

        
    }, [cryptos, cryptoinfoData]);

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => entry.name}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
            </ResponsiveContainer>

        </div>
    );
};

export default CryptoDonought;