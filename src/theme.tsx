import { createTheme } from "@mui/material"

export const MAIN_COLOR = "rgb(129 16 156)"
export const SECONDARY_COLOR = "rgb(238 101 126)"

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: MAIN_COLOR, 
      contrastText: "#ffffff",
      "100": "rgba(129, 16, 156, 0.1)",
      "200": "rgba(129, 16, 156, 0.2)",
      "300": "rgba(129, 16, 156, 0.3)",
      "400": "rgba(129, 16, 156, 0.4)",
      "500": "rgba(129, 16, 156, 0.5)",
      "600": "rgba(129, 16, 156, 0.6)",
      "700": "rgba(129, 16, 156, 0.7)",
      "800": "rgba(129, 16, 156, 0.8)",
      "900": "rgba(129, 16, 156, 0.9)", 
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: "#ffffff",
    },
    background: {
      paper: "#181818",
      default: "#23232b", // lighter than paper for contrast
    },
    action: {
      active: "#e1bee7", // light purple for active icons
      hover: "rgba(129, 16, 156, 0.15)", // light purple hover
      selected: "rgba(129, 16, 156, 0.25)", // slightly more visible selected
      disabled: "#888",
      disabledBackground: "rgba(255,255,255,0.08)",
      focus: "rgba(129, 16, 156, 0.20)",
    },
    success: {
      main: MAIN_COLOR,
      contrastText: "#ffffff",      
    },
    error: {
      main: SECONDARY_COLOR,
      contrastText: "#ffffff",
      "100": "rgba(238, 101, 126, 0.1)",
      "200": "rgba(238, 101, 126, 0.2)",
      "300": "rgba(238, 101, 126, 0.3)",
      "400": "rgba(238, 101, 126, 0.4)",
      "500": "rgba(238, 101, 126, 0.5)",
      "600": "rgba(238, 101, 126, 0.6)",
      "700": "rgba(238, 101, 126, 0.7)",
      "800": "rgba(238, 101, 126, 0.8)",
      "900": "rgba(238, 101, 126, 0.9)",
    },
  },
  shape: {
    borderRadius: 15
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#e1bee7", // light purple for icons by default
        },
      },
    },
  },
})
