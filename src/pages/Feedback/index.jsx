import React from 'react';
import { PSAForm } from 'shared-react-components/src';

const Feedback = () => (
  <PSAForm
    apiUrl="https://developfeedback.covercrop-data.org/v1/issues"
    submitMessage="Feedback submitted successfully"
    headerTitle="Cover Crop Seeding Rate Calculator Feedback"
    fields={[
      {
        type: 'text',
        label: 'Title',
        description: 'Give your feedback a short descriptive title.',
        props: {
          placeholder: 'Enter Your Title',
          variant: 'outlined',
          'data-test': 'feedback_title',
        },
        name: 'feedback_title',
        required: true,
      },
      {
        type: 'text',
        label: 'Message',
        description: 'Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.',
        props: {
          placeholder: 'Enter Your Feedback',
          multiline: true,
          variant: 'outlined',
          fullWidth: true,
          minRows: 3,
          'data-test': 'feedback_message',
        },
        name: 'feedback_message',
        required: true,
      },
      {
        type: 'checkbox',
        label: 'Topic',
        required: true,
        name: 'feedback_checkbox',
        options: [
          {
            label: 'About the Cover Crop Data',
            props: {
              name: 'feedback_data',
              'data-test': 'feedback_data',
            },
          },
          {
            label: 'About the Website',
            props: {
              name: 'feedback_website',
              'data-test': 'feedback_website',
            },
          },
          {
            label: 'Other',
            props: {
              name: 'feedback_other',
              'data-test': 'feedback_other',
            },
          },
        ],
      },
      {
        type: 'text',
        label: 'Name',
        props: {
          placeholder: 'Enter Name',
          variant: 'outlined',
          'data-test': 'feedback_name',
        },
        name: 'feedback_name',
      },
      {
        type: 'text',
        label: 'Email',
        props: {
          placeholder: 'Enter Email',
          variant: 'outlined',
          'data-test': 'feedback_email',
        },
        name: 'feedback_email',
      },
    ]}
    buttons={[
      {
        props: {
          title: 'Submit',
          variant: 'contained',
          color: 'primary',
          children: 'Submit',
        },
        action: 'submit',
      },
    ]}
    pirschAnalytics={(action, options) => console.log(`Analytics action: ${action}`, options)}
  />
);

export default Feedback;
