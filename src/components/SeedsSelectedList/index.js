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
import { CancelRounded } from '@mui/icons-material';

import {
  removeOptionRedux, removeSeedRedux, selectSidebarSeedRedux,
} from '../../features/calculatorSlice/actions';

const ExitIcon = ({ style }) => (
  <Box sx={style}>
    <CancelRounded style={{ color: '#FF0000' }} />
  </Box>
);

const SeedsSelectedList = ({ list }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const { sideBarSelection } = useSelector((state) => state.calculator);
  const { activeStep } = useSelector((state) => state.user);

  const selectSpecies = (seed) => {
    dispatch(selectSidebarSeedRedux(sideBarSelection === seed ? '' : seed));
  };

  const clickItem = (label) => {
    if (activeStep === 1) {
      dispatch(removeSeedRedux(label));
      dispatch(removeOptionRedux(label));
    } else {
      selectSpecies(label);
    }
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
              clickItem(s.label);
            }}
            >
              {activeStep === 1
              && (
              <ExitIcon
                style={{
                  position: 'absolute',
                  right: '0.0rem',
                  zIndex: 1,

                }}
              />
              )}
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
