import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header/Header';
import { useSelector } from 'react-redux';

const CryptoMultiScenario = ({ socket, waitingListSize, multiDetails }) => {
  const user = useSelector((state) => state.userReducer.user);
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');

  const handleBuy = () => {
    if (multiDetails && buyQuantity) {
      socket.emit('multi_action', { type: 'BUY', price: multiDetails, quantity: parseFloat(buyQuantity) });
    }
  };

  const handleSell = () => {
    if (multiDetails && sellQuantity) {
        socket.emit('multi_action', { type: 'SELL', price: multiDetails, quantity: parseFloat(sellQuantity) });
      }
  };

  const handleWait = () => {
    
    socket.emit('multi_action', {"type":"STAY", "price": null, "quantity": null});
   
  };

  useEffect(() => {
    if (socket) {
      socket.emit('multi_participate', user.login);
    }
  }, [socket, user]);

  return (
    <div>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        <div className="container mx-auto">
          {/* Display the waitingListSize */}
          <p>{waitingListSize}</p>

          {/* Buy Form */}
          <div className="flex space-x-4 mb-4">
            <button onClick={handleBuy}>
              Buy
            </button>
            <form>
              <label>
                Quantity:
                <input
                  type="number"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </label>
            </form>
          </div>

          {/* Sell Form */}
          <div className="flex space-x-4 mb-4">
            <button onClick={handleSell}>
              Sell
            </button>
            <form>
              <label>
                Quantity:
                <input
                  type="number"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </label>
            </form>
          </div>

          {/* Wait Button */}
          <button onClick={handleWait} >
            Wait
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoMultiScenario;
