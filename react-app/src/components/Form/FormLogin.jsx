import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { update_user_action } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

const FormLogin = ({ onConnect, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const data = await response.json();
      navigate('/home');

      const userinfo = await fetch('/user/' + String(data+1), {
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
      console.error('Erreur lors de la requête :', error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Connect
            </button>
            <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
