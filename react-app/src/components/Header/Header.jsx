import React, { useState, useEffect } from 'react';
import User from '../User/User.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { update_user_action } from '../../slices/userSlice';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom'; // Assurez-vous d'importer useNavigate

export const Header = ({ page }) => {
  let user = useSelector(state => state.userReducer.user);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const userToken = cookies.get('userToken');
  const navigate = useNavigate(); // Utilisez useNavigate pour obtenir la fonction de navigation

  const RetrieveUser = async (event) => {
    try {
      const userinfo = await fetch('http://localhost:8080/user/' + String(userToken), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userinfo.ok) {
        throw new Error(`Erreur HTTP! Statut : ${userinfo.status}`);
      }

      const userinfo1 = await userinfo.json();
      
      dispatch(update_user_action(userinfo1));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  
  useEffect(() => {
    RetrieveUser();
  }, [user.account]);

  const navigateToGame = () => {
    navigate('/game'); // Utilisez la fonction navigate pour naviguer vers la page '/game'
  }

  return (
    <header>
      <User name={user.login} email={user.email} balance={user.account} page={page} />
      <button onClick={navigateToGame}>Game</button> {/* Ajoutez un bouton "Game" qui appelle la fonction navigateToGame */}
    </header>
  );
};
