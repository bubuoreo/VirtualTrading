import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import GamePage from './pages/GamePage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import CryptoDetailsPage from './pages/CryptoDetailsPage.jsx';
import PersonalWalletPage from './pages/PersonalWalletPage.jsx';
import TransactionPage from './pages/TransactionPage.jsx';
import TransactionPageBy from './pages/TransactionPageBy.jsx';
import CryptoChartScenario from './pages/CryptoChartScenario.jsx';
import CryptoMultiScenario from './pages/CryptoMultiScenario.jsx';

import { update_crypto_data } from '../src/slices/cryptoSlice';
import { update_crypto_info } from '../src/slices/cryptodataSlice';
import { update_crypto_chart } from '../src/slices/cryptochartSlice.js';


export const App = () => {
  const user = useSelector((state) => state.userReducer.user);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const [resultScenario, setResultScenario] = useState(null);
  const [roomNumber, setRoomNumber] = useState(null);
  const [waitingListSize, setWaitingListSize] = useState(0);
  const [multiDetails, setMultiDetails] = useState(null);
  const [multiQuotes, setMultiQuotes] = useState([]);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseBody, setResponseBody] = useState('');

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
    setResponseBody('');
  };

  const handleResponseModalOpen = (body) => {
    setResponseBody(body);
    setResponseModalOpen(true);
  };

  const socketConnect = () => {
    socketRef.current = io('http://localhost:3000', { query: { id: user.id } });
    setSocketsListeners(socketRef.current);
  };

  const socketDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const setSocketsListeners = (socket) => {
    socket.on('/finance7j', function (data) {
      const result = JSON.parse(data);
      const code = result.meta.symbol;
      dispatch(update_crypto_data({ code, data: result.quotes }));
    });

    socket.on('/finance', function (data) {
      const result = JSON.parse(data);
      const symbol = result.symbol;
      dispatch(update_crypto_info({ symbol, data: result }));
    });

    socket.on('/financeChart', function (data) {
      const result = JSON.parse(data);
      dispatch(update_crypto_chart(result));
    });

    socket.on('/financeGame', function (data) {
      const resultScenario = JSON.parse(data);
      console.log(resultScenario);
      setResultScenario(resultScenario);
    });

    socket.on('multi_wait_update', function (data) {
      const result = JSON.parse(data);
      setWaitingListSize(result)
    });

    socket.on('multi_start', function (data) {
      const result = JSON.parse(data);
      setRoomNumber(result.pop());
      const latestQuotes = result.pop();
      setMultiQuotes([...multiQuotes, ...latestQuotes])
      setMultiDetails(result);
    });

    socket.on('multi_update', function (data) {
      const result = JSON.parse(data);
      console.log(result);
      setMultiDetails(result);
    });

    socket.on('multi_end_round', function (data) {
      const result = JSON.parse(data);
      const latestQuote = result.pop();
      setMultiQuotes([...multiQuotes, latestQuote]);
      setMultiDetails(result);
    });

    socket.on('multi_failure', function (message) {
      console.log(message);
      handleResponseModalOpen(JSON.stringify(message, null, 2));
    });

    socket.on('multi_end', function (data) {
      const result = JSON.parse(data);
      console.log(result);
      setMultiDetails(result);
    });
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage handleSocketDisconnect={socketDisconnect} />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/home" element={<HomePage socket={socketRef.current} handleSocketConnect={socketConnect} />} />
          <Route path="/crypto-details/:cryptoSymbol" element={<CryptoDetailsPage socket={socketRef.current} />} />
          <Route path="/wallet" element={<PersonalWalletPage socket={socketRef.current} />} />
          <Route path="/transactions/:cryptoSymbol" element={<TransactionPageBy />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/game" element={<GamePage socket={socketRef.current} result={resultScenario} />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/crypto-chart-scenario/:scenarioId" element={<CryptoChartScenario result={resultScenario} />} />
          <Route path="/crypto-chart-scenario/multi" element={<CryptoMultiScenario socket={socketRef.current} waitingListSize={waitingListSize} multiDetails={multiDetails} multiQuotes={multiQuotes} roomNumber={roomNumber}/>} />
        </Routes>
      </Router>
      <Modal isOpen={responseModalOpen} onClose={handleResponseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre>{responseBody}</pre>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleResponseModalClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default App;

