import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox, Snackbar, useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

const defaultFeedback = {
  repository: 'dst-feedback',
  title: '',
  comments: '',
  labels: [],
  name: '',
  email: '',
};

const defaultSnackbar = { open: false, message: '', color: '' };

const Feedback = () => {
  const [feedback, setFeedback] = useState(defaultFeedback);
  const [snackbarData, setSnackbarData] = useState(defaultSnackbar);
  const [alertMessage, setAlertMessage] = useState('');

  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const siteCondition = useSelector((state) => state.siteCondition);

  const headerLogo = () => {
    if (siteCondition.council === '') return './PSALogo.png';
    if (siteCondition.council === 'MCCC') return './mccc-logo.png';
    if (siteCondition.council === 'NECCC') return './neccc-logo.png';
    return undefined;
  };

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setFeedback({ ...feedback, labels: [...feedback.labels, e.target.name] });
    } else {
      const arr = [...feedback.labels];
      const index = arr.indexOf(e.target.name);
      if (index > -1) {
        arr.splice(index, 1);
        setFeedback({ ...feedback, labels: [...arr] });
      }
    }
  };

  const formValidation = () => {
    const titleMissing = feedback.title === '';
    const commentsMissing = feedback.comments === '';
    const labelsMissing = feedback.labels.length === 0;
    const messageArr = [];

    const convertMessageArr = (arr) => {
      if (arr.length === 0) {
        return '';
      }
      if (arr.length === 1) {
        return `The "${arr[0]}" field is blank`;
      }
      if (arr.length === 2) {
        return `The "${arr.join('" and "')}" fields are blank`;
      }
      return `The "${arr.slice(0, -1).join('", "')}", and "${arr[arr.length - 1]}" fields are blank`;
    };

    if (titleMissing) {
      messageArr.push('Title');
    }
    if (commentsMissing) {
      messageArr.push('Message');
    }
    if (labelsMissing) {
      messageArr.push('Topic');
    }
    if (titleMissing || commentsMissing || labelsMissing) {
      const messageStr = convertMessageArr(messageArr);
      setAlertMessage(messageStr);
      return false;
    }
    setAlertMessage('');
    return true;
  };

  const handleSubmit = () => {
    fetch('https://developfeedback.covercrop-data.org/v1/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...feedback, labels: ['dst-seedcalc', ...feedback.labels] }),
    })
      .then((response) => {
        if (response.status === 201) {
          setSnackbarData({
            open: true,
            message: 'Feedback Successfully Submitted!',
            color: 'green',
          });
        } else if (response.status === 400) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Bad Request`,
            color: 'red',
          });
        } else if (response.status === 422) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Unprocessable Entry`,
            color: 'red',
          });
        } else if (response.status === 500) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Internal Server Error`,
            color: 'red',
          });
        }
        return response.json();
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
  };

  useEffect(() => {
    formValidation();
  }, [feedback]);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        paddingTop="0.625rem"
        height="85px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <img
          alt={siteCondition.council}
          src={headerLogo()}
          height="75px"
        />
        <Typography variant="dstHeader" pl="1rem">
          Seeding Rate Calculator
        </Typography>
      </Grid>

      <Grid container item spacing={1} padding="0 10%" style={{ textAlign: 'justify' }}>
        {/* Title */}
        <Grid item xs={12}>
          <Typography variant={matchesMd ? 'h6' : 'h4'}>
            Cover Crop Seeding Rate Calculator Feedback
          </Typography>
        </Grid>

        {/* Feedback Title */}
        <Grid item xs={12}>
          <Typography variant="h6">
            Title
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Typography padding="0.5rem 0">Give your feedback a short descriptive title.</Typography>
          <TextField
            placeholder="Enter Your Title"
            value={feedback.title}
            onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
            data-test="feedback_title"
          />
        </Grid>

        {/* Feedback Messsage */}
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            Message
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Typography padding="0.5rem 0">
            Explain your feedback as thoroughly as you can. Your feedback will help us improve the
            species selection experience. You can attach a screenshot of your feedback below.
          </Typography>
          <TextField
            placeholder="Enter Your Feedback"
            multiline
            fullWidth
            value={feedback.comments}
            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
            data-test="feedback_message"
          />
        </Grid>

        {/* Feedback Topic */}
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            Topic
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Typography variant="body1" padding="0.5rem 0">What is this feedback about?</Typography>
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={feedback.labels.indexOf('About the Cover Crop Data') > -1}
                  onChange={handleCheckbox}
                  name="About the Cover Crop Data"
                  data-test="feedback_data"
                />
              )}
              label="About the Cover Crop Data"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={feedback.labels.indexOf('About the Website') > -1}
                  onChange={handleCheckbox}
                  name="About the Website"
                  data-test="feedback_website"
                />
              )}
              label="About the Website"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={feedback.labels.indexOf('Other') > -1}
                  onChange={handleCheckbox}
                  name="Other"
                  data-test="feedback_other"
                />
              )}
              label="Other"
            />
          </FormGroup>
        </Grid>

        {/* Name */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Name </Typography>
          <TextField
            placeholder="Enter Name"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            data-test="feedback_name"
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Email </Typography>
          <TextField
            placeholder="Enter Email"
            value={feedback.email}
            onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
            data-test="feedback_email"
          />
        </Grid>

        <Grid item xs={12} p="1rem">
          {alertMessage !== ''
          && (
          <Typography variant="body1" style={{ color: 'red' }} p="0.5rem 0" data-test="feedback_alert">
            {alertMessage}
            . Please fill all required fields before submitting.
          </Typography>
          )}
          <Button variant="contained" onClick={() => navigate('/')} data-test="feedback_back">
            Back
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: '1rem' }}
            disabled={alertMessage !== ''}
            onClick={handleSubmit}
            data-test="feedback_submit"
          >
            Submit
          </Button>
        </Grid>

      </Grid>

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={5000}
        onClose={() => setSnackbarData(defaultSnackbar)}
        message={snackbarData.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        color={snackbarData.color}
      />
    </Grid>

  );
};

export default Feedback;
