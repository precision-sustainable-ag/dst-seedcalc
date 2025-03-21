import React from 'react';
import {
  Box, Grid, Typography,
} from '@mui/material';
import { PSAAccordion, PSAModal } from 'shared-react-components/src';

// TODO: not used now
const DSTModal = ({
  isOpen,
  setModal,
  handleClose,
  title,
  description,
  style,
}) => (
  <PSAModal
    open={isOpen}
    onClose={setModal}
    style={style}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    modalContent={(
      <Box className="home-import-modal">
        <Grid container>
          <Grid xs={3} item />
          <Grid xs={6} item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
          </Grid>
          <Grid xs={3} item />
          <Grid xs={2} item />
          <Grid xs={8} item>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {description}
            </Typography>
          </Grid>
          <Grid xs={2} item />
          <Grid xs={8} item />
          <Grid xs={4} item>
            <PSAAccordion
              buttonType=""
              sx={{ marginTop: '15px' }}
              onClick={handleClose}
              title="Close"
            />
          </Grid>
        </Grid>
      </Box>
    )}
  />
);

export default DSTModal;
