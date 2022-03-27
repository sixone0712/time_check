import { createTheme } from '@mui/material';
import { green, purple } from '@mui/material/colors';

const primaryGreen = green[500];
const accentGreen = green.A200;
const darkGreen = green[900];
const primaryPurple = purple[500];
const accentPurple = purple.A200;
const darkPurple = purple[900];

export const overridings = {
  // name: 'Dark Theme',
  // palette: {
  //   primary: {
  //     light: accentPurple,
  //     main: primaryPurple,
  //     dark: darkPurple,
  //     contrastText: '#fff',
  //   },
  //   type: 'dark',
  //   secondary: {
  //     light: accentGreen,
  //     main: primaryGreen,
  //     dark: darkGreen,
  //     contrastText: '#fff',
  //   },
  // },
  typography: {
    fontFamily: 's-core-dream-regular',
  },
};

export default createTheme(overridings);
