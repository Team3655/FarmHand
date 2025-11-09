import { createTheme } from "@mui/material/styles";
import {
  anton,
  impact,
  antonio,
  baskervville,
  libreBaskervville,
} from "../../utils/Fonts";

const TractorDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#339900",
      dark: "#2d8500",
      light: "#4db82e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffd400",
      dark: "#f9a825",
      light: "#fff59d",
      contrastText: "rgba(0,0,0,0.87)",
    },
    error: {
      main: "#ed1c24",
      light: "#ff5252",
      dark: "#c41e3a",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0066b3",
      light: "#42a5f5",
      dark: "#004c8c",
      contrastText: "#ffffff",
    },
    success: {
      main: "#00897b",
      dark: "#00695c",
      light: "#26a69a",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f57c00",
      dark: "#e65100",
      light: "#ff9800",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.7)",
      disabled: "rgba(255,255,255,0.5)",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    h1: {
      fontFamily: '"Impact", "Anton"',
    },
    h2: {
      fontFamily: '"Impact", "Anton"',
    },
    h3: {
      fontFamily: '"Impact", "Anton"',
    },
    h4: {
      fontFamily: '"Anton", "Antonio"',
    },
    h5: {
      fontFamily: "Antonio",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "Antonio",
      fontWeight: 500,
    },
    button: {
      fontFamily: "Antonio",
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "Antonio",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "Antonio",
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Baskervville", "Libre Baskervville"',
      fontWeight: 300,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Anton';
          src: ${anton.src};
        }

        @font-face {
          font-family: 'Impact';
          src: ${impact.src};
        }
        
        @font-face {
          font-family: 'Antonio';
          src: ${antonio.src};
        }
        
        @font-face {
          font-family: 'Baskervville';
          src: ${baskervville.src};
        }

        @font-face {
          font-family: 'Libre-Baskerville';
          src: ${libreBaskervville.src};
        }
      `,
    },
  },
});

export default TractorDarkTheme;
