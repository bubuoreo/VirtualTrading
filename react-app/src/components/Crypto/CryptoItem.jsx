import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CryptoCourbe7 from './CryptoCourbe7';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { update_crypto_data } from '../../slices/cryptoSlice'; 
import { update_crypto_info } from '../../slices/cryptodataSlice';  

const MotionTr = chakra(motion.tr);

const CryptoItem = () => {
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
  const user = useSelector((state) => state.userReducer.user);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', { query: { id: user.id } });
    setSocketsListeners(socketRef.current);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user.id, dispatch]);

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
  };
  const formatPrice = (price) => {
    const parts = price.toFixed(2).split('.');
    const formattedInteger = parseInt(parts[0]).toLocaleString();
    return `${formattedInteger}.${parts[1]}`;
  };
  // Use the cryptoinfoData from the Redux store directly
  const tableData = Object.keys(cryptoinfoData).map(symbol => {
    const cryptoInfo = cryptoinfoData[symbol];
    return {
      crypto: cryptoInfo.symbol,
      Ychangepercent: cryptoInfo.fiftyTwoWeekChangePercent.toFixed(2),
      price: formatPrice(cryptoInfo.regularMarketPrice),
      marketcap: cryptoInfo.marketCap.toLocaleString(),
      volume: cryptoInfo.volume24Hr.toLocaleString(),
      logo: cryptoInfo.coinImageUrl,
      supply: cryptoInfo.circulatingSupply.toLocaleString(),
    };
  });



  return (
    <Table variant="simple" mt="8">
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Crypto</Th>
          <Th>Price</Th>
          <Th>% 1 year</Th>
          <Th>MarketCap</Th>
          <Th>Supply</Th>
          <Th>Volume 24H</Th>
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
            <Td><img src={rowData.logo} style={{ width: '25px', height: '25px' }} alt={rowData.crypto}></img></Td>
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.crypto}</Link></Td>
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.price}</Link></Td>
            <Td>
              <Link
                to={`/crypto-details/${rowData.crypto}`}
                style={{ color: rowData.Ychangepercent >= 0 ? 'green' : 'red' }}
              >
                {rowData.Ychangepercent}%
              </Link>
            </Td>
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.marketcap}</Link></Td>
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.supply}</Link></Td>
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>{rowData.volume}</Link></Td>
            <Td>
              <Link to={`/crypto-details/${rowData.crypto}`}>
                <CryptoCourbe7 symbol={rowData.crypto} />
              </Link>
            </Td>
          </MotionTr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CryptoItem;
