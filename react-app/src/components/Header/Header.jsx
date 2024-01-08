import React from 'react';
import User from '../User/User.jsx';
import { useSelector } from 'react-redux';

export const Header = ({ page }) => {
  let user = useSelector(state => state.userReducer.user);

  return (

    <header>
      <User name={user.login} email={user.email} balance={user.account} page={page}/>
    </header>
  );
};

