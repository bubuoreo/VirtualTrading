// CryptoItem.jsx
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CryptoCourbe7 from './CryptoCourbe7';
import FormBuy from '../Form/FormBuy';
import FormSell from '../Form/FormSell';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

const MotionTr = chakra(motion.tr);

const CryptoItemPersonal = ({ cryptos, amounts, socket }) => {
    const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
    const [tableData, setTableData] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const { isOpen: isBuyModalOpen, onOpen: onBuyModalOpen, onClose: onBuyModalClose } = useDisclosure();
    const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure();
    const [totalValue, setTotalValue] = useState(0);

    const handleBuy = (cryptoSymbol) => {
        setSelectedCrypto(cryptoSymbol);
        onBuyModalOpen();
    };

    const handleSell = (cryptoSymbol) => {
        setSelectedCrypto(cryptoSymbol);
        onSellModalOpen();
    };

    const handleModalClose = () => {
        setSelectedCrypto(null);
        onBuyModalClose();
        onSellModalClose();
    };

    const calculateUSDAmount = (amount, cryptoPrice) => {
        return (amount * cryptoPrice).toFixed(2);
    };

    const cryptoString = cryptos.join('/');
    useEffect(() => {
        if (socket) {
            socket.emit('update_page', '/wallet/' + cryptoString);
        }
        
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

    useEffect(() => {
        const total = tableData.reduce((acc, rowData) => {
            const amount = amounts[tableData.findIndex(item => item.crypto === rowData.crypto)];
            const cryptoValue = calculateUSDAmount(amount, rowData.price);
            return acc + parseFloat(cryptoValue);
        }, 0);

        setTotalValue(total.toFixed(2));
    }, [tableData, amounts]);

    return (
        <div>
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
                            <Td><img src={rowData.logo} style={{ width: '25px', height: '25px' }} alt={rowData.crypto} /></Td>
                            <Td><Link to={`/transactions/${rowData.crypto}`}>{rowData.crypto}</Link></Td>
                            <Td><Link to={`/transactions/${rowData.crypto}`}>{rowData.price}</Link></Td>
                            <Td>{amounts[tableData.findIndex(item => item.crypto === rowData.crypto)]}</Td>
                            <Td>{calculateUSDAmount(amounts[tableData.findIndex(item => item.crypto === rowData.crypto)], rowData.price)}</Td>
                            <Td>
                                <Button onClick={() => handleBuy(rowData.crypto)}>BUY</Button>
                                <Modal isOpen={isBuyModalOpen} onClose={handleModalClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Confirmation</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <FormBuy cryptoSymbol={selectedCrypto}></FormBuy>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="blue" onClick={handleModalClose}>
                                                Return
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Td>
                            <Td>
                                <Button onClick={() => handleSell(rowData.crypto)}>SELL</Button>
                                <Modal isOpen={isSellModalOpen} onClose={handleModalClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Confirmation</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <FormSell cryptoSymbol={selectedCrypto}></FormSell>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="blue" onClick={handleModalClose}>
                                                Return
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Td>
                            <Td><Link to={`/transactions`}>
                                <CryptoCourbe7 symbol={rowData.crypto} />
                            </Link></Td>
                        </MotionTr>
                    ))}
                </Tbody>
            </Table>

            <div style={{ marginTop: '16px' }}>
                <strong>Total Value: ${totalValue}</strong>
            </div>
        </div>
    );
};

export default CryptoItemPersonal;
