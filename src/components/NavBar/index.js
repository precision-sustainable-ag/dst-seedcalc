import React, { useState } from 'react';
import {
  Box, Button, Menu, MenuItem, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import AuthButton from '../Auth/AuthButton';
import { releaseNotesUrl } from '../../shared/data/keys';

const NavBar = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated } = useAuth0();

  const navigate = useNavigate();

  const openMenu = (e) => {
    setAnchor(e.target);
  };

  const closeMenu = () => setAnchor(null);

  return (
    <Box height="100%" display="flex" justifyContent="flex-end" alignItems="center" pr="1rem">
      {matchesMd
        ? (
          <>
            <Button onClick={openMenu} data-test="open_menu">
              <MenuIcon />
            </Button>
            <Menu anchorEl={anchor} open={open} onClose={closeMenu}>
              <MenuItem onClick={() => window.open(releaseNotesUrl)}>
                <Typography fontSize="0.875rem" fontWeight="bold" data-test="release_notes">
                  Release Notes
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/feedback')}>
                <Typography fontSize="0.875rem" fontWeight="bold" data-test="feedback">
                  Feedback
                </Typography>
              </MenuItem>
              <MenuItem sx={{ p: '0 0.5rem' }}>
                <AuthButton
                  variant="text"
                  type={isAuthenticated ? 'Logout' : 'Login'}
                />
              </MenuItem>
            </Menu>
          </>
        )
        : (
          <>
            <Button onClick={() => window.open(releaseNotesUrl)} sx={{ textTransform: 'none' }} data-test="release_notes">
              <Typography fontSize="0.875rem" fontWeight="bold">
                Release Notes
              </Typography>
            </Button>
            <Button onClick={() => navigate('/feedback')} sx={{ textTransform: 'none' }} data-test="feedback">
              <Typography fontSize="0.875rem" fontWeight="bold">
                Feedback
              </Typography>
            </Button>
            <AuthButton
              variant="text"
              type={isAuthenticated ? 'Logout' : 'Login'}
            />
          </>
        )}
    </Box>
  );
};
export default NavBar;
