// CryptoItem.jsx
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CryptoCourbe7 from './CryptoCourbe7';
import FormBuy from '../Form/FormBuy';
import FormSell from '../Form/FormSell';
import { Link } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';

import io from 'socket.io-client';

const MotionTr = chakra(motion.tr);

const CryptoItemPersonal = ({ cryptos, amounts }) => {
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [tableData, setTableData] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure(); // Hook to control modal visibility

    const handleBuy = (cryptoSymbol) => {
        setSelectedCrypto(cryptoSymbol);
        onOpen(); // Open the modal when the "BUY" button is clicked
    };

    const handleSell = (cryptoSymbol) => {
        setSelectedCrypto(cryptoSymbol);
        onOpen(); // Open the modal when the "BUY" button is clicked
    };

    const handleModalClose = () => {
        setSelectedCrypto(null);
        onClose();
      };

    const calculateUSDAmount = (amount, cryptoPrice) => {
        return (amount * cryptoPrice).toFixed(2); // Fixer à 8 décimales pour Bitcoin
    };

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
                            marketcap: data.marketCap.toLocaleString(),
                            volume: data.volume24Hr.toLocaleString(),
                            logo: data.coinImageUrl,
                            supply: data.circulatingSupply.toLocaleString(),
                        };
                    })
                );

                setTableData(newData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, [cryptos]);
    //     const socket = io('http://localhost:3000');

    //     socket.on('cryptoData', (update) => {
    //         setTableData((prevData) =>
    //         prevData.map((item) =>
    //             item.crypto === update.symbol
    //             ? {
    //                 ...item,
    //                 open: data.regularMarketOpen.toFixed(2),
    //                 close: data.regularMarketPrice.toFixed(2),
    //                 high: data.regularMarketDayHigh.toFixed(2),
    //                 low: data.regularMarketDayLow.toFixed(2),
    //                 marketcap: data.marketCap.toLocaleString(),
    //                 volume: data.volume24Hr.toLocaleString(),
    //                 logo: data.coinImageUrl,
    //                 supply: data.circulatingSupply.toLocaleString(),
    //                 }
    //             : item
    //         )
    //         );
    //     });

    //     return () => socket.disconnect();
    //   }, []); // Empty dependency array ensures useEffect runs once on mount


    return (
        <Table variant="simple" mt="8">
            <Thead>
                <Tr>
                    <Th></Th>
                    <Th>Crypto</Th>
                    <Th>Price</Th>
                    <Th>Amount</Th>
                    <Th>Value</Th>
                    <Th></Th>
                    <Th></Th>
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
                        <Td><img src={rowData.logo} style={{ width: '25px', height: '25px' }}></img></Td>
                        <Td><Link to={`/transactions/${rowData.crypto}`}>{rowData.crypto}</Link></Td>
                        <Td><Link to={`/transactions/${rowData.crypto}`}>{rowData.close}</Link></Td>
                        <Td>{amounts[tableData.findIndex(item => item.crypto === rowData.crypto)]}</Td>
                        <Td>{calculateUSDAmount(amounts[tableData.findIndex(item => item.crypto === rowData.crypto)], rowData.close)}</Td>
                        <Td><Button onClick={() => handleBuy(rowData.crypto)}>BUY</Button>
                            <Modal isOpen={isOpen} onClose={handleModalClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Confirmation</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormBuy cryptoSymbol={selectedCrypto}></FormBuy>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="blue" onClick={handleModalClose}>
                                            OK
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Td>
                        <Td><Button onClick={() => handleSell(rowData.crypto)}>SELL</Button>
                            <Modal isOpen={isOpen} onClose={handleModalClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Confirmation</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormSell cryptoSymbol={selectedCrypto}></FormSell>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="blue" onClick={handleModalClose}>
                                            OK
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Td>
                        <Td><Link to={`/transactions`}>
                            {/* Render the CryptoCourbe7 component for each row */}
                            <CryptoCourbe7 symbol={rowData.crypto} /></Link>
                        </Td>
                    </MotionTr>
                ))}
            </Tbody>
        </Table>
    );
};

export default CryptoItemPersonal;
