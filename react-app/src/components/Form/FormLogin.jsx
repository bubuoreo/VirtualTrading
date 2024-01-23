import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { update_user_action } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  Flex
} from '@chakra-ui/react';
import Cookies from 'universal-cookie';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const FormLogin = ({ onConnect, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseBody, setResponseBody] = useState('');

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
    setResponseBody('');
  };

  const handleResponseModalOpen = (body) => {
    setResponseBody(body);
    setResponseModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost/auth', {
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
        const data = await response.json();
        handleResponseModalOpen(JSON.stringify(data.message, null, 2));
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const data = await response.json();

      navigate('/home');

      const userinfo = await fetch('http://localhost/user/' + String(data), {
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
      const userToken = userinfo1.id; // Remplacez cela par le vrai token obtenu lors de l'authentification
      const cookies = new Cookies();
      cookies.set('userToken', userToken, { path: '/' });
    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Flex
  direction="column"
  align="center"
  justify="center"
  h="100vh"
  bg="gray.100"
  >
  <Heading mb="4">Sign In</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4} width="300px">
      <FormControl mb="4">
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </FormControl>
      <FormControl mb="6">
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          type="password"
          id="password"
          placeholder="******************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </FormControl>
      <Flex justify="space-between">
        <Button
          onClick={handleSubmit}
          colorScheme="green"
          type="submit"
          className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Connect
        </Button>
        <Button
          onClick={handleRegisterClick}
          colorScheme="blue"
          className="inline-block align-baseline font-bold text-sm hover:text-blue-800"
        >
          Register
        </Button>
      </Flex>
      </Stack>
    </form>
    <Modal isOpen={responseModalOpen} onClose={handleResponseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Authentification Failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre>{responseBody}</pre>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleResponseModalClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

</Flex>
  );
};

export default FormLogin;
