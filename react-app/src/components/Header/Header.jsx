import React, { useState, useEffect } from 'react';
import User from '../User/User.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { update_user_action } from '../../slices/userSlice';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Heading } from '@chakra-ui/react'; // Importez les composantes Chakra UI nécessaires

export const Header = ({ page }) => {
  var user = useSelector(state => state.userReducer.user);

  return (
    <Box as="header" textAlign="center" p="4">
      <User name={user.login} email={user.email} balance={user.account} page={page} />
    </Box>
  );
};
