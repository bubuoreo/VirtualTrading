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
      // You can customize Button styles here
    },
    Table: {
      // You can customize Table styles here
    },
    // Add more component styles as needed
  },
});

export default theme;