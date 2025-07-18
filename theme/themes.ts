'use client';
import { createTheme } from '@mui/material/styles';
import { roboto } from './fonts';
import useHonchoTypography from '@/honchoTheme';

// Get the typography styles from your custom hook
const honchoTypography = useHonchoTypography();

const theme = createTheme({
  typography: {
    // Modify the fontFamily property to include fallbacks
    fontFamily: [
      roboto.style.fontFamily, // This is the 'var(--font-roboto)'
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),

    // 2. Spread in all your custom typography variants
    ...honchoTypography,
  },
  // You can also customize colors, spacing, etc. here
  // palette: { ... }
});

export default theme;