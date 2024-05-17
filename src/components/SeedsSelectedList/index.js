import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Box,
  useMediaQuery,
  Card,
  CardActionArea,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeOptionRedux, removeSeedRedux, selectSidebarSeedRedux,
} from '../../features/calculatorSlice/actions';

const CheckBoxIcon = ({ style }) => (
  <Box sx={style}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M14 0H4C1.79086 0 0 1.79086 0 4V14C0 16.2091 1.79086 18 4 18H14C16.2091 18 18 16.2091 18 14V4C18 1.79086 16.2091 0 14 0Z"
        fill="red"
      />
      <path
        d="M4 4L14 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4L4 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

const SeedsSelectedList = ({ list }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const { sideBarSelection } = useSelector((state) => state.calculator);

  const selectSpecies = (seed) => {
    dispatch(selectSidebarSeedRedux(sideBarSelection === seed ? '' : seed));
  };

  return (
    <Box
      sx={
        matchesMd
          ? {
            minHeight: '100px',
            whiteSpace: 'normal',
            overflowX: 'auto',
          }
          : {
            height: '100%',
          }
      }
      bgcolor="#e5e7d5"
      border="#c7c7c7 solid 1px"
      display="flex"
      flexDirection={matchesMd ? 'row' : 'column'}
    >
      {[...list].reverse().map((s, i) => (
        <Box minWidth={matchesMd ? '120px' : ''} key={i}>

          <Card
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              cursor: 'pointer',
            }}
          >

            <CardActionArea onClick={() => {
              selectSpecies(s.label); dispatch(removeSeedRedux(s.label));
              dispatch(removeOptionRedux(s.label));
            }}
            >
              <CheckBoxIcon
                style={{
                  position: 'absolute',
                  right: '0.0rem',
                  zIndex: 1,

                }}
              />
              <img
                style={{
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  marginTop: '10px',
                }}
                src={
                    s.thumbnail !== null && s.thumbnail !== ''
                      ? s.thumbnail
                      : 'https://placehold.it/250x150?text=Placeholder'
                  }
                alt={s.label}
                loading="lazy"
              />
              <Typography fontSize="12px" lineHeight={1.25}>
                {s.label}
              </Typography>
            </CardActionArea>
          </Card>
        </Box>
      ))}
      {' '}
    </Box>
  );
};

export default SeedsSelectedList;
