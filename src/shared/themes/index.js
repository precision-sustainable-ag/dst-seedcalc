/* eslint-disable no-unused-vars */
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
      background: '#e5e7d5',
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
    MuiButton: {
      variants: [
        {
          props: { variant: 'stepper' },
          style: {
            textTransform: 'none',
            padding: '0.5rem',
            // border: '1px solid #4F5F30',
            // '&.Mui-disabled': {
            //   color: '#757575',
            //   border: '1px solid #737373',
            //   backgroundColor: '#F0F0F0',
            // },
          },
        },
      ],
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

const testTheme = createTheme({
  palette: {
    primary: {
      main: '#598445',
    },
    secondary: {
      main: '#27739E',
    },
    error: {
      main: '#DD3804',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#565656',
    },
    main: {
      accent1: '#598445',
      accent2: '#27739E',
      background1: '#E9E6E0',
      text: '#1F1F1F',
    },
    additional: {
      background2: '#F5F5F5',
      grey2: '#AAAAAA',
      grey1: '#737373',
      greydark: '#565656',
      support1: '#416782',
      support2: '#408D79',
      support3: '#C48B0F',
      support4: '#91643B',
      support5: '#624469',
      error: '#DD3804',
    },
  },
  typography: {
    fontFamily: [
      '"IBM Plex Sans"',
      '"Roboto"',
      '"Helvetica Neue"',
      '"Arial"',
      'sans-serif',
    ].join(','),
    color: '#1F1F1F',
    header: {
      color: '#1F1F1F',
      fontFamily: 'IBM Plex Sans',
      fontSize: '2.5rem',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: 'normal',
    },
    subtitle: {
      color: '#1F1F1F',
      fontFamily: 'IBM Plex Sans',
      fontSize: '1.25rem',
      fontStyle: 'italic',
      fontWeight: 500,
      lineHeight: 'normal',
    },
    button: {
      fontWeight: 600,
    },
  },
});

const dstTheme = createTheme(deepmerge(theme, testTheme));

export default dstTheme;
