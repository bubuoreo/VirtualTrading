import React from 'react';
import { useNavigate } from 'react-router-dom';
import binanceLogo from '../../assets/binance-logo-0.png'
import { Img, Button } from '@chakra-ui/react';

const User = ({ name, email, balance, page }) => {
  
  const navigate = useNavigate();

  const handleHome = async () => {
    navigate('/home');
  };

  const navigateToGame = () => {
    navigate('/game'); // Utilisez la fonction navigate pour naviguer vers la page '/game'
  }

  const navigateToNews = () => {
    navigate('/news'); // Utilisez la fonction navigate pour naviguer vers la page '/news'
  }

  const handleWallet = async () => {
    navigate('/wallet');
  };

  return (
    <div className="ui clearing segment">
      <h3 className="ui right floated header " style={{ lineHeight: '3' }}>
        <i className="user circle outline icon" onClick={handleWallet} style={{cursor: 'pointer'}}></i>
        <div className="content">
          <span id="userNameId">{name}</span>
          <div className="sub header"><span>{balance}</span>$</div>
        </div>
      </h3>
      <h3 className="ui left floated header">
        {/* Utilisez la balise img pour afficher le logo de Binance */}
        <Img
          src={binanceLogo} // Assurez-vous d'ajuster le chemin en conséquence
          alt="Binance Logo"
          style={{
            width: '80px',
            height: '80px',
            cursor: 'pointer',
            // Ajoutez d'autres styles selon vos besoins
          }}
          onClick={handleHome}
        />
      </h3>
      {/* Bouton Game ici */}
      <Button onClick={navigateToGame} style={{ float: 'left', marginLeft: '20px', marginTop: '25px' }}>Game</Button>
      {/* Bouton News ici */}
      <Button onClick={navigateToNews} style={{ float: 'left', marginLeft: '20px', marginTop: '25px' }}>News</Button>
    </div>
  );
};

export default User;
