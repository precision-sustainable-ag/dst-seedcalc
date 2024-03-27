import React, { useState } from 'react';
import {
  Box, Button, Menu, MenuItem, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import AuthButton from '../Auth/AuthButton';

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
            <Button onClick={openMenu}>
              <MenuIcon />
            </Button>
            <Menu anchorEl={anchor} open={open} onClose={closeMenu}>
              <MenuItem sx={{ p: '0 1rem' }}>
                <AuthButton
                  variant="text"
                  type={isAuthenticated ? 'Logout' : 'Login'}
                />
              </MenuItem>
              <MenuItem onClick={() => navigate('/feedback')}>
                <Typography fontSize="0.875rem" fontWeight="bold">
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography fontSize="0.875rem" fontWeight="bold">
                  Feedback
                </Typography>
              </MenuItem>

            </Menu>
          </>
        )
        : (
          <>
            <Button>
              <Typography fontSize="0.875rem" fontWeight="bold">
                Profile
              </Typography>
            </Button>
            <Button onClick={() => navigate('/feedback')}>
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
