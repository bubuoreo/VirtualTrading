import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionTr = chakra(motion.tr);

const CryptoItem = () => {
    const [cryptos, setCryptos] = useState(['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD']);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await Promise.all(
                    cryptos.map(async (crypto) => {
                        const response = await fetch(`http://localhost:3000/finance/${crypto}`);
                        const data = await response.json();

                        return {
                            crypto,
                            open: data.regularMarketOpen.toFixed(2),
                            close: data.regularMarketPrice.toFixed(2),
                            high: data.regularMarketDayHigh.toFixed(2),
                            low: data.regularMarketDayLow.toFixed(2),
                        };
                    })
                );

                setTableData(newData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId);
    }, [cryptos]);

    return (
        <Table variant="simple" mt="8">
            <Thead>
                <Tr>
                    <Th>Crypto</Th>
                    <Th>Open</Th>
                    <Th>Close</Th>
                    <Th>High</Th>
                    <Th>Low</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tableData.map((rowData) => (
                    <MotionTr
                        key={rowData.crypto}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Utilisez le composant Link pour créer un lien vers la CryptoDetailsPage avec le symbole de la crypto-monnaie en tant que paramètre d'URL */}
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.crypto}</Link></Td>
                        <Td>{rowData.open}</Td>
                        <Td>{rowData.close}</Td>
                        <Td>{rowData.high}</Td>
                        <Td>{rowData.low}</Td>
                    </MotionTr>
                ))}
            </Tbody>
        </Table>
    );
};

export default CryptoItem;
