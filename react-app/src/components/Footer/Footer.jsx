// Import des bibliothèques nécessaires
import React, { useState } from 'react';
import { Button, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react';
import Cookies from 'universal-cookie';

// Création de la fonction de composant Footer
export const Footer = () => {
    // Initialisation des cookies
    const cookies = new Cookies();

    const [darkMode, setDarkMode] = useState(false);
    const { toggleColorMode } = useColorMode();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        toggleColorMode(); // Changer le mode de couleur en utilisant Chakra UI
    };


    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        // Suppression du cookie
        cookies.remove('yourCookieName'); // Remplacez 'yourCookieName' par le nom de votre cookie

        // Redirection vers la page de connexion ou une autre page de votre choix
        window.location.href = '/';
    };


    // Rendu du composant Footer
    return (
        <Flex
            as="footer"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg={darkMode ? 'gray.800' : 'gray.200'} 
            color={darkMode ? 'white' : 'black'}
        >
            {/* Ajoutez d'autres éléments du footer ici si nécessaire */}

            {/* Bouton de déconnexion */}
            <Button onClick={handleLogout} variant="outline">
                Logout
            </Button>

            {/* Bouton de basculement entre le mode sombre et le mode clair */}
            <Button onClick={toggleDarkMode}>
                {darkMode ? 'Switch off' : 'Switch on'} Dark Mode
            </Button>
        </Flex>
    );
};

// Export du composant Footer par défaut
export default Footer;
