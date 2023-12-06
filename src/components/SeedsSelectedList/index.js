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
import { updateSteps } from '../../features/stepSlice';
import { selectSidebarSeedRedux } from '../../features/calculatorSlice/actions';

const SeedsSelectedList = ({ list }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { selectedSpecies } = data.speciesSelection;

  const handleUpdateStore = (type, key, val) => {
    const newData = {
      type,
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  const selectSpecies = (seed) => {
    handleUpdateStore(
      'speciesSelection',
      'selectedSpecies',
      selectedSpecies === seed ? '' : seed,
    );
    dispatch(selectSidebarSeedRedux(selectedSpecies === seed ? '' : seed));
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
            <CardActionArea onClick={() => selectSpecies(s.label)}>
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
