import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#00796B",
      dark: "#00695C",
      light: "#E0F2F1",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7FAF9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#17201F",
      secondary: "#5F6B68",
    },
    divider: "#D7DEDC",
    error: {
      main: "#B42318",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 600,
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
});
