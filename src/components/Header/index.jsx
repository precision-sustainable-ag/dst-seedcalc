/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PSALogoDisplayer } from 'shared-react-components/src';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import NavBar from '../NavBar';
// import PSAHeader from './psaheader';
import { releaseNotesUrl } from '../../shared/data/keys';
import { PSAHeader } from 'shared-react-components/src';

const Header = () => {
  const navigate = useNavigate();
  const { council } = useSelector((state) => state.siteCondition);

  const navButtons = [
    {
      variant: 'text',
      text: 'Release Notes',
      icon: <TextSnippetOutlinedIcon />,
      rightIcon: true,
      style: { fontSize: '1rem' },
      textSx: { fontSize: '1rem' },
      onClick: () => window.open(releaseNotesUrl),
      
    },
    {
      variant: 'text',
      text: 'About',
      icon: <InfoOutlinedIcon />,
      rightIcon: true,
      textSx: { fontSize: '1rem' },
      onClick: () => navigate('/about'),
    },
    {
      variant: 'text',
      text: 'Feedback',
      icon: <ChatBubbleOutlineIcon />,
      rightIcon: true,
      textSx: { fontSize: '1rem' },
      onClick: () => navigate('/feedback'),

    },

  ];

  return (
    <>
      {/* <Grid
        container
        paddingTop="0.625rem"
        height="85px"
        justifyContent="center"
      >
        <Grid
          item
          xs={9}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={() => navigate('/')} data-test="header_logo_button">
            <PSALogoDisplayer
              council={council}
              alt={council}
              style={{
                height: '75px',
              }}
            />
          </Button>
          <Typography variant="dstHeader" pl="1rem" data-test="page_caption">
            Seeding Rate Calculator
          </Typography>
        </Grid>
        <Grid item xs={3} md={6}>
          <NavBar />
        </Grid>
      </Grid> */}
      <PSAHeader
        title="Seeding Rate Calculator"
        council={council}
        navButtons={navButtons}
        onLogoClick={() => navigate('/')}
      />
    </>
  );
};
export default Header;
