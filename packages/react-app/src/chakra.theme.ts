// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const MainCard = {
  baseStyle: {
    borderRadius: 'lg',
    borderWidth: '1px',
    bg: 'white',
    maxW: 'lg',
    minW: 'sm',
    py: 6,
    px: 4,
  },
};

export default extendTheme({
  colors,
  components: {
    MainCard,
  },
});
