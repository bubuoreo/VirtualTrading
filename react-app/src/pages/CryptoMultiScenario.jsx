import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header/Header';
import { useSelector } from 'react-redux';

const CryptoMultiScenario = ({ socket, waitingListSize, multiDetails }) => {
    const user = useSelector((state) => state.userReducer.user);
    const buyQuantity = useRef();
    const sellQuantity = useRef();

    const handleBuy = () => {
        console.log(multiDetails)
        console.log(buyQuantity.current.value)
        if (multiDetails && buyQuantity.current.value) {
            socket.emit('multi_action', { "type": 'BUY', "price": multiDetails[2].close, "quantity": buyQuantity.current.value });
        }
    };

    const handleSell = () => {
        console.log(multiDetails)
        console.log(sellQuantity.current.value)
        if (multiDetails && sellQuantity.current.value) {
            socket.emit('multi_action', { type: 'SELL', price: multiDetails[2].close, quantity: sellQuantity.current.value });
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
                                    ref={buyQuantity}
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
                                    ref={sellQuantity}
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
