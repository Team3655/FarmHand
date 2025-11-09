import Impact from "../assets/fonts/impact.ttf";
import Baskervville from "../assets/fonts/Baskervville-VariableFont_wght.ttf";
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


export const baskervville = {
  fontFamily: "baskervville",
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('Baskervville'),
    url(${Baskervville}) format('truetype')
  `,
};