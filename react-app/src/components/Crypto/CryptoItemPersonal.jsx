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
                        <Td><Link to={`/transactions/${rowData.crypto}`}>{rowData.price}</Link></Td>
                        <Td>{amounts[tableData.findIndex(item => item.crypto === rowData.crypto)]}</Td>
                        <Td>{calculateUSDAmount(amounts[tableData.findIndex(item => item.crypto === rowData.crypto)], rowData.price)}</Td>
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
