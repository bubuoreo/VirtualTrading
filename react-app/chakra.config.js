// chakra.config.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      500: '#ff6347', // Customize your brand color
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'full',
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        futuristic: {
          bg: 'transparent',
          color: 'brand.500',
          border: '2px solid',
          borderColor: 'brand.500',
          _hover: {
            bg: 'brand.500',
            color: 'white',
          },
        },
      },
      defaultProps: {
        variant: 'futuristic',
      },
    },
    // Add more component styles as needed
  },
});

export default theme;
