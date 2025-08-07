import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { PSATheme } from 'shared-react-components/src';

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#4F5F30',
  //     light: '#FFFFF2',
  //     dark: '#eff1e0',
  //     text: '#4F5F30',
  //   },
  // },
  typography: {
    // TODO: need to review every variants here
    stepCaption: {
      fontSize: '1.25rem',
      fontWeight: 800,
      lineHeight: '1.5rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      background: '#598445',
      color: 'white',
      fontFamily: [
        '"IBM Plex Sans"',
        '"Roboto"',
        '"Helvetica Neue"',
        '"Arial"',
        'sans-serif',
      ].join(','),
    },
    mathIcon: {
      marginTop: '30px',
      fontWeight: 600,
      lineHeight: '1.5',
    },
    stepHeader: {
      lineHeight: '1.5',
      padding: '0 1rem',
      background: '#e9e6e0',
      margin: '1rem 0',
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          mathIcon: 'p',
          stepHeader: 'p',
          stepCaption: 'p',

          // --- MUI Defaults ---
          // TODO: MUI Defaults might be replaced when provide custom variants
          // h1: 'h1',
          // h2: 'h2',
          // h3: 'h3',
          // h4: 'h4',
          // h5: 'h5',
          // h6: 'h6',
          // subtitle1: 'h6',
          // subtitle2: 'h6',
          // body1: 'p',
          // body2: 'p',
          // inherit: 'p',
          // button: 'span',
          // caption: 'span',
          // overline: 'span',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          // color: '#4F5F30',
        },
      },
    },
  },
});

const dstTheme = createTheme(deepmerge(theme, PSATheme));

export default dstTheme;
