import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';
import FormBuy from '../components/Form/FormBuy';
import FormSell from '../components/Form/FormSell';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import { Flex,Box } from "@chakra-ui/react";


const CryptoDetailsPage = ({socket}) => {
  const { cryptoSymbol } = useParams();


  return (
    <div>
      <Header />
      <Box>
        <div className="container mx-auto">
          {/* CryptoCourbe prend toute la largeur */}
          <div>
            <CryptoCourbe cryptoSymbol={cryptoSymbol} socket={socket} />
          </div>
  
          <div className="flex">
            {/* CryptoInfo à gauche */}
            <div className="flex-1">
              <CryptoInfo cryptoSymbol={cryptoSymbol} />
            </div>
            {/* FormAction à droite */}
            <Flex align="center" justify="center">
              <div><FormBuy cryptoSymbol={cryptoSymbol}/></div>
              <FormSell cryptoSymbol={cryptoSymbol}/>
            </Flex>
          </div>
        </div>
      </Box>
      <Box mt="50px"> {/* Ajoutez le margin-top pour le padding ici */}
        <Footer />
      </Box>
    </div>
  );
};

export default CryptoDetailsPage;
