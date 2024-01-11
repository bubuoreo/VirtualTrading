import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

const UserForm = ({ onSubmit, onCancel }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState('');
  const [money, setMoney] = useState(0);
  const [password, setPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0,
          login: username,
          pwd: password,
          email: email,
          surName: surname,
          account: money,
          lastName: lastname,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }
  };

  const handleCancel = () => {
    // Show the modal when Cancel is clicked
    onOpen();
  };

  const handleModalClose = () => {
    // Close the modal
    onClose();
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      bg="gray.100"
    >
      <Heading mb="4">Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4} width="300px">
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormControl>
          
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="surname">First Name</FormLabel>
            <Input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Last Name</FormLabel>
            <Input
              id="lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="money">Money</FormLabel>
            <Input
              id="money"
              type="number"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <Flex justify="space-between">
            <Button colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="teal">
              OK
            </Button>
          </Flex>
        </Stack>
      </form>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Inscris-toi quand même à ce site de GOAT.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleModalClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default UserForm;
