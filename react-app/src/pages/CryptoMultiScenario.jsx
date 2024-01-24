import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Box, Text, useStatStyles } from '@chakra-ui/react';
import { Header } from '../components/Header/Header';
import Leaderboard from '../components/Game/Leaderboard.jsx';
import CryptoCourbeMulti from '../components/Crypto/CryptoCourbeMulti.jsx';
import ChatComponent from '../components/Chat/Chat';

const CryptoMultiScenario = ({ socket, waitingListSize, multiDetails, multiQuotes, roomNumber, messageArray }) => {
    const user = useSelector((state) => state.userReducer.user);
    const buyQuantity = useRef();
    const sellQuantity = useRef();
    const [me, setMe] = useState(null);
    
    useEffect(() => {
        if (multiDetails) {
            console.log(multiDetails);
            setMe(multiDetails.find(element => element.id == user.id));
        }
    }, [multiDetails]);

    const handleBuy = () => {
        console.log(buyQuantity.current.value);
        if (buyQuantity.current.value) {
            socket.emit('multi_action', {
                type: 'BUY',
                price: multiQuotes[multiQuotes.length - 1].close,
                quantity: parseFloat(buyQuantity.current.value),
            });
        }
    };

    const handleSell = () => {
        console.log(sellQuantity.current.value);
        if (sellQuantity.current.value) {
            socket.emit('multi_action', {
                type: 'SELL',
                price: multiQuotes[multiQuotes.length - 1].close,
                quantity: parseFloat(sellQuantity.current.value),
            });
        }
    };

    const handleWait = () => {
        socket.emit('multi_action', { type: 'STAY', price: null, quantity: null });
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
                    {roomNumber && me && <ChatComponent socket={socket} users={multiDetails} nickname={me.nickname} messageArray={messageArray} />}

                    <div className="flex space-x-4 mb-4">
                        <div className="flex-1">
                            <CryptoCourbeMulti multiQuotes={multiQuotes} />
                        </div>
                        <div className="flex-1 ml-4">
                            <div className="mb-4">
                                <Button colorScheme="green" onClick={handleBuy}>
                                    Buy
                                </Button>
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
                                <Button colorScheme="red" onClick={handleSell}>
                                    Sell
                                </Button>
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
                            <Button colorScheme="gray" onClick={handleWait}>
                                Wait
                            </Button>
                        </div>
                        <div className="flex-1 ml-4">
                            {multiDetails && me && (
                                <Box>
                                    <Text>Money available: {me.wallet}</Text>
                                    <Text>Asset quantity: {parseFloat(me.assetQuantity)}</Text>
                                    <Text>Crypto price: {multiQuotes[multiQuotes.length - 1].close}</Text>
                                    <Text>
                                        Total Value: {me.wallet + parseFloat(me.assetQuantity) * multiQuotes[multiQuotes.length - 1].close}
                                    </Text>
                                </Box>
                            )}
                        </div>
                        <div className="flex-1 ml-4">
                            {multiDetails && multiQuotes && <Leaderboard marketPrice={multiQuotes[multiQuotes.length - 1].close} users={multiDetails} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoMultiScenario;