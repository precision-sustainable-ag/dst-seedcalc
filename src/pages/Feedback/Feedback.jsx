import React from 'react';
import { PSAForm } from 'shared-react-components/src';

const Feedback = () => (
  <PSAForm
    apiUrl="https://developfeedback.covercrop-data.org/v1/issues"
    submitMessage="Feedback submitted successfully"
    headerTitle="Cover Crop Seeding Rate Calculator Feedback"
    repository="dst-feedback"
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
        name: 'title',
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
        name: 'comments',
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
              name: 'About the Cover Crop Data',
              'data-test': 'feedback_data',
            },
          },
          {
            label: 'About the Website',
            props: {
              name: 'About the Websit',
              'data-test': 'feedback_website',
            },
          },
          {
            label: 'Other',
            props: {
              name: 'Other',
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
        name: 'name',
      },
      {
        type: 'text',
        label: 'Email',
        props: {
          placeholder: 'Enter Email',
          variant: 'outlined',
          'data-test': 'feedback_email',
        },
        name: 'email',
      },
    ]}
    buttons={[
      {
        props: {
          title: 'Submit',
          variant: 'contained',
          color: 'primary',
          children: 'Submit',
          'data-test': 'feedback_submit',
        },
        action: 'submit',
      },
    ]}
  />
);

export default Feedback;
