import React, { useState } from 'react';

import { Header } from '../components/Header/Header.jsx';
import ActionButton from '../components/ActionButton/ActionButton.jsx';

const HomePage = () => {
    return (
        <div >
            <Header page={"Home"}/>
            {/* <div className='d-flex align-items-center justify-content-center mt-5'>
                <ActionButton action="buy" label="Buy" />
                <ActionButton action="sell" label="Sell" />
                <ActionButton action="selection" label="Play" />
            </div> */}
        </div>
    );
};

export default HomePage;