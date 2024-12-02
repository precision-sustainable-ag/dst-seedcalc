import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import { PSAHeader, PSAAuthButton } from 'shared-react-components/src';
import { releaseNotesUrl } from '../../shared/data/keys';

const Header = () => {
  const navigate = useNavigate();
  const { council } = useSelector((state) => state.siteCondition);

  const navContent = [
    {
      type: 'button',
      variant: 'text',
      text: 'Profile',
      icon: <SupervisedUserCircleOutlinedIcon />,
      rightIcon: true,
      textSx: { fontSize: '1rem' },
      onClick: () => navigate('/profile'),
    },
    {
      type: 'button',
      variant: 'text',
      text: 'Release Notes',
      icon: <TextSnippetOutlinedIcon />,
      rightIcon: true,
      style: { fontSize: '1rem' },
      textSx: { fontSize: '1rem' },
      onClick: () => window.open(releaseNotesUrl),
    },
    {
      type: 'button',
      variant: 'text',
      text: 'About',
      icon: <InfoOutlinedIcon />,
      rightIcon: true,
      textSx: { fontSize: '1rem' },
      onClick: () => navigate('/about'),
    },
    {
      type: 'button',
      variant: 'text',
      text: 'Feedback',
      icon: <ChatBubbleOutlineIcon />,
      rightIcon: true,
      textSx: { fontSize: '1rem' },
      onClick: () => navigate('/feedback'),
    },
    {
      type: 'component',
      component: <PSAAuthButton />,
    },
  ];

  return (
    <PSAHeader
      title="Seeding Rate Calculator"
      council={council}
      onLogoClick={() => navigate('/')}
      navContent={navContent}
    />
  );
};
export default Header;
