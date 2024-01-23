import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MotionTr = chakra(motion.tr);

const CryptoItemTransactionBy = ({cryptoSymbol}) => {
    
    let user = useSelector(state => state.userReducer.user);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transacinfo = await fetch('http://localhost/transactions/user/' + String(user.id)+'/'+ cryptoSymbol, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!transacinfo.ok) {
                    throw new Error(`Erreur HTTP! Statut : ${transacinfo.status}`);
                }

                const transacinfo1 = await transacinfo.json();
                console.log(transacinfo1);
                setTableData(transacinfo1);

            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        fetchData();

    }, []);

    return (
        <Table variant="simple" mt="8">
            <Thead>
                <Tr>
                    <Th>DateTime</Th>
                    <Th>Crypto</Th>
                    <Th>TransactionType</Th>
                    <Th>Price</Th>
                    <Th>TransactionPrice</Th>
                    <Th>Quantity</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tableData.map((rowData) => (
                    <MotionTr
                        key={rowData.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.dateTime}</Link></Td>
                        <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.symbol}</Link></Td>
                        <Td>{rowData.type}</Td>
                        <Td>{rowData.assetPrice}</Td>
                        <Td>{rowData.transactionPrice}</Td>
                        <Td>{rowData.assetQuantity}</Td>
                    </MotionTr>
                ))}
            </Tbody>
        </Table>
    );
};

export default CryptoItemTransactionBy;
