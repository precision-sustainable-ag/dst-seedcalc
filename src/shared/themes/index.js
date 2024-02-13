import { createTheme } from '@mui/material/styles';

const dstTheme = createTheme({
  palette: {
    primary: {
      main: '#4F5F30',
      light: '#FFFFF2',
      dark: '#eff1e0',
      text: '#4F5F30',
    },
  },
  breakpoints: {
    values: {
      xs: 280,
      sm: 600,
      md: 912,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    dstHeader: {
      fontSize: '1.25rem',
      fontWeight: 800,
      textShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 800,
      lineHeight: '1.5rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      backgroundColor: 'rgba(79, 95, 48, 0.09)',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: '#4F5F30',
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'stepper' },
          style: {
            textTransform: 'none',
            padding: '0.5rem 0',
          },
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#4F5F30',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#eff1e0',
          height: '3rem',

        },
        content: {
          '& .MuiTypography-root': {
            fontSize: '1.25rem',
            lineHeight: '1.5rem',
            fontWeight: '600',
            textAlign: 'justify',
          },
        },
        expandIconWrapper: {
          transform: 'none',
          WebkitTransform: 'none',
          transition: 'none',
          WebkitTransition: 'none',
          '&.Mui-expanded': {
            transform: 'none',
            WebkitTransform: 'none',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          color: '#4F5F30',
          padding: '1rem 0',
          backgroundColor: '#fffff2',
        },
      },
    },
  },
});

export default dstTheme;
