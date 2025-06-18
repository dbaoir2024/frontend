// Theme configuration for the OIR Dashboard application
// Based on Mantis Dashboard style with professional color scheme

export const themeConfig = {
  // Color palette
  colors: {
    primary: {
      main: '#1e88e5', // Primary blue
      light: '#64b5f6',
      dark: '#0d47a1',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#26a69a', // Teal accent
      light: '#4db6ac',
      dark: '#00796b',
      contrastText: '#ffffff'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    background: {
      paper: '#ffffff',
      default: '#f8f9fa'
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e'
    }
  },

  // Typography
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.3
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.4
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none'
    }
  },

  // Spacing
  spacing: 8, // Base spacing unit in pixels

  // Breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },

  // Component styling
  components: {
    // Card styling
    card: {
      borderRadius: '12px',
      boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)'
    },
    // Button styling
    button: {
      borderRadius: '8px',
      padding: '8px 16px'
    },
    // Input styling
    input: {
      borderRadius: '8px'
    },
    // Table styling
    table: {
      headerBgColor: '#f5f5f5',
      borderColor: '#e0e0e0',
      hoverColor: '#f5f7fa'
    },
    // Sidebar styling
    sidebar: {
      width: 260,
      closedWidth: 72,
      bgColor: '#ffffff',
      textColor: '#616161',
      activeTextColor: '#1e88e5',
      activeBgColor: '#e3f2fd'
    },
    // Header styling
    header: {
      height: 70,
      bgColor: '#ffffff',
      textColor: '#616161'
    }
  },

  // Dark mode configuration (for future implementation)
  darkMode: {
    background: {
      paper: '#1e1e1e',
      default: '#121212'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#6c6c6c'
    }
  }
};

export default themeConfig;
