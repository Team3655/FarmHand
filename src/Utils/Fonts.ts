import Impact from "../assets/fonts/impact.ttf";
import Antonio from "../assets/fonts/Antonio-VariableFont_wght.ttf";
import Baskervville from "../assets/fonts/Baskervville-VariableFont_wght.ttf";
import LibreBaskervville from "../assets/fonts/LibreBaskerville-Regular.ttf";

import Anton from "../assets/fonts/Anton-Regular.ttf";

export const anton = {
  fontFamily: "Anton",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('Anton'),
    local('Anton-Regular'),
    url(${Anton}) format('truetype')
  `,
};

export const impact = {
  fontFamily: "Impact",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('Impact'),
    url(${Impact}) format('truetype')
  `,
};

export const antonio = {
  fontFamily: "Antonio-regular",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('Antonio'),
    url(${Antonio}) format('truetype')
  `,
};

export const baskervville = {
  fontFamily: "baskervville",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('Baskervville'),
    url(${Baskervville}) format('truetype')
  `,
};

export const libreBaskervville = {
  fontFamily: "libre-baskervville",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('LibreBaskervville'),
    url(${LibreBaskervville}) format('truetype')
  `,
};

// const Fonts = {
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: `
//       @font-face {
//         font-family: "Impact";
//         src: url(${Impact}) format('truetype');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       }

//       @font-face {
//         font-family: "Antonio";
//         src: url(${Antonio}) format('truetype');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       }

//       @font-face {
//         font-family: "Baskervville";
//         src: url(${Baskervville}) format('truetype');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       }

//       @font-face {
//         font-family: "Libre Baskervville";
//         src: url(${LibreBaskervville}) format('ttf');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       },

//       @font-face {
//         font-family: "Anton";
//         src: url(${Anton}) format('truetype');
//         font-weight: normal;
//         font-style: normal;
//         font-display: swap;
//       }`,
//     },
//   },
// };
