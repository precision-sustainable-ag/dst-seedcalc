import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { PSATheme } from 'shared-react-components/src';

const theme = createTheme({
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
    mathIcon: {
      marginTop: '30px',
      fontWeight: 600,
      lineHeight: '1.5',
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    },
    stepHeader: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      lineHeight: '1.5',
      padding: '0 1rem',
      background: '#e5e7d5',
      margin: '1rem 0',
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: '#4F5F30',
        variantMapping: {
          mathIcon: 'p',
          stepHeader: 'p',
        },
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
  },
});

const dstTheme = createTheme(deepmerge(PSATheme, theme));

export default dstTheme;
