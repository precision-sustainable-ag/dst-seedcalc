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
  removeMixRatioOptionRedux,
  removeOptionRedux,
  removeSeedRedux,
  selectSidebarSeedRedux,
  setMixRatioOptionRedux,
} from '../../features/calculatorSlice/actions';
import { historyStates } from '../../features/userSlice/state';
import {
  setHistoryStateRedux,
  setMaxAvailableStepRedux,
} from '../../features/userSlice/actions';

const ExitIcon = ({ style }) => (
  <Box sx={style}>
    <CancelRounded style={{ color: '#FF0000' }} />
  </Box>
);

const SeedsSelectedList = ({ activeStep }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const { sideBarSelection, seedsSelected, mixRatioOptions } = useSelector(
    (state) => state.calculator,
  );
  const { historyState, maxAvailableStep } = useSelector((state) => state.user);

  const selectSpecies = (seed) => {
    dispatch(selectSidebarSeedRedux(sideBarSelection === seed ? '' : seed));
  };

  const clickItem = (label) => {
    if (activeStep === 1) {
      if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
      // remove selected crop
      dispatch(removeSeedRedux(label));
      dispatch(removeMixRatioOptionRedux(label));
      dispatch(removeOptionRedux(label));
      if (maxAvailableStep > 0) dispatch(setMaxAvailableStepRedux(0));
      // reset percentOfRate in mixRatioOptions when there's any change in species selection
      seedsSelected.forEach((s) => {
        const seedOption = mixRatioOptions[s.label];
        dispatch(
          setMixRatioOptionRedux(s.label, {
            ...seedOption,
            percentOfRate: null,
          }),
        );
      });
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
      {[...seedsSelected].reverse().map((s, i) => (
        <Box minWidth={matchesMd ? '120px' : ''} key={i}>
          <Card
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              cursor: 'pointer',
            }}
            data-test={`sidebar-${s.label}`}
          >
            <CardActionArea
              onClick={() => {
                clickItem(s.label);
              }}
              aria-label={`click to ${activeStep === 1 ? 'remove' : 'open'} selected crop: ${s.label}`}
            >
              <Box position="relative" width="90px" margin="auto">
                {activeStep === 1 && (
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
                  aria-hidden="true"
                />
              </Box>

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
