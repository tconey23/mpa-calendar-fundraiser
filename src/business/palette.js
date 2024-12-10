import { createTheme } from "@mui/material/styles";

const lightPalette = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#80C2AF",
      hover: "#70798C", 
      contrastText: "#1B2A41",
      avatar: '#FFE75D'
    },
    text: {
      primary: "#1B2A41",
      secondary: "#0C1821",
      avatar: '#1B2A41'
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },
});

const darkPalette = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#70798C",
      hover: "#70798C",
      contrastText: "#F5F1ED",
      avatar: '#A0DDE6',
      logo: 'white'
    },
    text: {
      primary: "#A0DDE6",
      secondary: "#F5F1ED",
      avatar: '#1B2A41'
    },
    background: {
      default: "#2A2D34",
      paper: "#3C3F45",
    },
  },
});

export { lightPalette, darkPalette };
