import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CryptoCourbe7 from './CryptoCourbe7';
import { Link } from 'react-router-dom';
//import io from 'socket.io-client';

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
              Ychangepercent: data.fiftyTwoWeekChangePercent.toFixed(2),
              price: formatPrice(data.regularMarketPrice),
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

    const formatPrice = (price) => {
      const parts = price.toFixed(2).split('.');
      const formattedInteger = parseInt(parts[0]).toLocaleString();
      return `${formattedInteger}.${parts[1]}`;
    };
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [cryptos]);

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
            <Td><Link to={`/crypto-details/${rowData.crypto}`}>
              {/* Render the CryptoCourbe7 component for each row */}
                <CryptoCourbe7 symbol={rowData.crypto} /></Link>
            </Td>
          </MotionTr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CryptoItem;
