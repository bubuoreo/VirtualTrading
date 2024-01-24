import React, { useState, useEffect } from 'react';
import User from '../User/User.jsx';
import { useSelector, useDispatch } from 'react-redux';

export const Header = ({ page }) => {
  var user = useSelector(state => state.userReducer.user);

  return (
    <header>
      <User name={user.login} email={user.email} balance={user.account} page={page} />
    </header>
  );
};
