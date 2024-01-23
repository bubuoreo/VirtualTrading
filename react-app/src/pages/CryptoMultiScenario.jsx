import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header/Header';
import { useSelector } from 'react-redux';
import Leaderboard from '../components/Game/Leaderboard.jsx'

import CryptoCourbeMulti from '../components/Crypto/CryptoCourbeMulti.jsx';


const CryptoMultiScenario = ({ socket, waitingListSize, multiDetails, multiQuotes, roomNumber }) => {
    const user = useSelector((state) => state.userReducer.user);
    const buyQuantity = useRef();
    const sellQuantity = useRef();

    const handleBuy = () => {

        console.log(buyQuantity.current.value)
        if (buyQuantity.current.value) {
            socket.emit('multi_action', { "type": 'BUY', "price": multiQuotes[multiQuotes.length - 1].close, "quantity": parseFloat(buyQuantity.current.value) });
        }
    };

    const handleSell = () => {

        console.log(sellQuantity.current.value)
        if (sellQuantity.current.value) {
            socket.emit('multi_action', { "type": 'SELL', "price": multiQuotes[multiQuotes.length - 1].close, "quantity": parseFloat(sellQuantity.current.value) });
        }
    };

    const handleWait = () => {

        socket.emit('multi_action', { "type": "STAY", "price": null, "quantity": null });

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
                    {waitingListSize && <p>Users in the waiting list : {waitingListSize}</p>}
                    {roomNumber && <p>You are in game in the room : {roomNumber}</p>}

                    <div className="flex space-x-4 mb-4">
                        <button onClick={handleBuy}>
                            Buy
                        </button>
                        <form>
                            <label>
                                Quantity:
                                <input
                                    type="number"
                                    ref={buyQuantity}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </label>
                        </form>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <button onClick={handleSell}>
                            Sell
                        </button>
                        <form>
                            <label>
                                Quantity:
                                <input
                                    type="number"
                                    ref={sellQuantity}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </label>
                        </form>
                    </div>

                    <button onClick={handleWait} >
                        Wait
                    </button>

                    {multiDetails && <p>multiDetails : {multiDetails[0].wallet}</p>}
                    {multiDetails && <p>multiDetails : {parseFloat(multiDetails[0].assetQuantity)}</p>}
                    {multiDetails && <p>multiQutoes : {multiQuotes[multiQuotes.length - 1].close}</p>}
                    {multiDetails && <p>Total Value{multiDetails[0].wallet + parseFloat(multiDetails[0].assetQuantity) * multiQuotes[multiQuotes.length - 1].close}</p>}
                    <CryptoCourbeMulti multiQuotes={multiQuotes}/>
                    {multiDetails && multiQuotes && <Leaderboard marketPrice={multiQuotes[multiQuotes.length - 1].close} users={multiDetails}/>}
                </div>
            </div>
        </div>
    );
};

export default CryptoMultiScenario;
