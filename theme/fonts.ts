import { Roboto } from 'next/font/google';

export const roboto = Roboto({
  weight: ['400', '500', '700'], // Added '500' as your theme uses it
  subsets: ['latin'],
  display: 'swap', // Recommended for font performance
});