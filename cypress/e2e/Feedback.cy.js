import { clickStateMap } from '../support/utils';

describe('Feedback', () => {
  beforeEach(() => {
    cy.visit('/feedback');
  });

  it('should display different council logo in different councils', () => {
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/PSA_logo.png');
    clickStateMap();
    cy.getByTestId('feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/mwccc_logo.png');
    clickStateMap('NECCC');
    cy.getByTestId('feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/neccc_logo.png');
    clickStateMap('SCCC');
    cy.getByTestId('feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/sccc_logo.png');
  });

  // it('should be return back to map if click back button', () => {
  //   cy.getByTestId('feedback_back').click();
  //   cy.url().should('equal', Cypress.config().baseUrl);
  // });

  it('should not be available to submit until all fields are filled', () => {
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_title').type('title');
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_message').type('message');
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_alert').should('not.exist');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_submit').should('not.be.disabled');
  });
});

describe('Feedback api', () => {
  const feedbackUrl = 'https://developfeedback.covercrop-data.org/v1/issues';
  beforeEach(() => {
    cy.visit('/feedback');
    cy.getByTestId('feedback_title').type('title');
    cy.getByTestId('feedback_message').type('message');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_name').type('test');
    cy.getByTestId('feedback_email').type('test');
  });

  it('should be able to show success feedback api response', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 201 }).as('success');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@success');
    cy.getByTestId('feedback_snackbar')
      .find('.MuiSnackbarContent-message').invoke('text').should('contains', 'Feedback Successfully Submitted!');
  });
  it('should be able to show feedback api response with status code 400', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 400 }).as('badRequest');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@badRequest');
    cy.getByTestId('feedback_snackbar')
      .find('.MuiSnackbarContent-message').invoke('text').should('contains', 'Bad Request');
  });
  it('should be able to show feedback api response with status code 422', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 422 }).as('unprocessableEntry');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@unprocessableEntry');
    cy.getByTestId('feedback_snackbar')
      .find('.MuiSnackbarContent-message').invoke('text').should('contains', 'Unprocessable Entry');
  });
  it('should be able to show feedback api response with status code 500', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 500 }).as('serverError');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@serverError');
    cy.getByTestId('feedback_snackbar')
      .find('.MuiSnackbarContent-message').invoke('text').should('contains', 'Internal Server Error');
  });
});
