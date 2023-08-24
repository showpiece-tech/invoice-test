import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    regular: '#3498db',
    dark: '#2980b9',
  },
}

const styles = {
  global: {
    'html, body': {
      background: 'gray.50',
    },
  }
};

export const theme = extendTheme({ colors, styles })