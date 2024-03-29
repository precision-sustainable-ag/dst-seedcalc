import React from 'react';
import {
  Box, Grid, Modal, Typography, Button,
} from '@mui/material';

// TODO: not used now
const DSTModal = ({
  isOpen,
  setModal,
  handleClose,
  title,
  description,
  style,
}) => (
  <Modal
    open={isOpen}
    onClose={setModal}
    style={style}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
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
          <Button sx={{ marginTop: '15px' }} onClick={handleClose}>
            Close
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Modal>
);

export default DSTModal;
