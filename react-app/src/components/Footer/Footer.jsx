import React from 'react';
import { Button, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react';
import Cookies from 'universal-cookie';

export const Footer = () => {
    const cookies = new Cookies();
    const { toggleColorMode, colorMode } = useColorMode();
    const bgColor = useColorModeValue('gray.200', 'gray.800');
    const isDarkMode = colorMode === 'dark';

    const handleLogout = () => {
        // Supprimer le cookie
        cookies.remove('yourCookieName'); // Remplacez 'yourCookieName' par le nom de votre cookie

        // Rediriger vers la page de connexion ou une autre page de votre choix
        window.location.href = '/';
    };

    const handleToggleWhiteMode = () => {
        // Forcer le mode couleur en mode clair
        if (isDarkMode) {
            toggleColorMode();
        }
    };

    return (
        <Flex
            as="footer"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg={bgColor}
            color="white"
        >
            {/* Ajoutez d'autres éléments du footer ici si nécessaire */}

            <Button onClick={handleLogout} variant="outline">
                Logout
            </Button>
            <Button onClick={isDarkMode ? toggleColorMode : handleToggleWhiteMode} variant="outline">
                {isDarkMode ? 'Toggle White Mode' : 'Toggle Dark Mode'}
            </Button>
        </Flex>
    );
};

export default Footer;
