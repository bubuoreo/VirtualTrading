// CryptoItem.jsx
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CryptoCourbe7 from './CryptoCourbe7';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MotionTr = chakra(motion.tr);

const CryptoItemPersonal = ({ cryptos, amounts, socket }) => {
    const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
    const [tableData, setTableData] = useState([]);


    const cryptoString = cryptos.join('/'); // Convertir la liste en chaîne de caractères
    console.log(cryptoinfoData)
    useEffect(() => {
        socket.emit('update_page', '/wallet/'+cryptoString); // Utiliser la chaîne de caractères
    }, [cryptoString]);

    useEffect(() => {
        const newData = cryptos.map(crypto => {
            const cryptoInfo = cryptoinfoData[crypto];
            return {
                crypto,
                price: cryptoInfo.regularMarketPrice.toFixed(2) || 0,
                logo: cryptoInfo.coinImageUrl || '',
            };
        });

        setTableData(newData);
    }, [cryptos, cryptoinfoData]);

    const calculateUSDAmount = (amount, cryptoPrice) => {
        return (amount * cryptoPrice).toFixed(2);
    };

    return (
        <Table variant="simple" mt="8">
            <Thead>
                <Tr>
                    <Th></Th>
                    <Th>Crypto</Th>
                    <Th>Price</Th>
                    <Th>Amount</Th>
                    <Th>Value</Th>
                    <Th>
                        <div style={{ marginLeft: '90px' }}>Chart</div>
                    </Th>
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
                        <Td><img src={rowData.logo} style={{ width: '25px', height: '25px' }} alt={rowData.crypto} /></Td>
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.crypto}</Link></Td>
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.price}</Link></Td>
                        <Td>{amounts[tableData.findIndex(item => item.crypto === rowData.crypto)]}</Td>
                        <Td>{calculateUSDAmount(amounts[tableData.findIndex(item => item.crypto === rowData.crypto)], rowData.price)}</Td>
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>
                            <CryptoCourbe7 symbol={rowData.crypto} />
                        </Link></Td>
                    </MotionTr>
                ))}
            </Tbody>
        </Table>
    );
};

export default CryptoItemPersonal;
