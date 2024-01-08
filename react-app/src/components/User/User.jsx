import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = ({ name, email, balance, page }) => {

  const navigate = useNavigate();

  const handleHome = async () => {
    navigate('/home');
  };

  return (

    <div class="ui clearing segment">
            <h3 class="ui right floated header">
                <i class="user circle outline icon"></i>
                <div class="content">
                    <span id="userNameId">{name}</span>
                    <div class="sub header"><span>{balance}</span>$</div>
                </div>
            </h3>
            <h3 class="ui left floated header">
                <i class="money icon" onClick={handleHome}></i>
                <div class="content">
                    {page}
                    <div class="sub header">{page} your card to get money</div>
                </div>
            </h3>
    </div>

);
};

export default User;
