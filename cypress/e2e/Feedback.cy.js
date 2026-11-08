import { selectMapState } from '../support/utils';

describe('Feedback', () => {
  beforeEach(() => {
    cy.visit('/feedback');
  });

  // the nav links collapse into a menu at the default 1000px viewport
  it('should display different council logo in different councils', { viewportWidth: 1440, viewportHeight: 900 }, () => {
    // logos are imported assets, so the path and hash differ between dev and production builds
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src').and('include', 'PSA_logo');
    selectMapState();
    cy.getByTestId('navbar-Feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src').and('include', 'mwccc_logo');
    selectMapState('NECCC');
    cy.getByTestId('navbar-Feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src').and('include', 'neccc_logo');
    selectMapState('SCCC');
    cy.getByTestId('navbar-Feedback').click();
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src').and('include', 'sccc_logo');
  });

  it('should be return back to map if click back button', () => {
    cy.getByTestId('header_logo_button').click();
    cy.url().should('equal', Cypress.config().baseUrl);
  });

  it('should not be available to submit until all fields are filled', () => {
    cy.getByTestId('feedback_submit').should('be.disabled');
    cy.getByTestId('feedback_title').type('title');
    cy.getByTestId('feedback_submit').should('be.disabled');
    cy.getByTestId('feedback_message').type('message');
    cy.getByTestId('feedback_submit').should('be.disabled');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_alert').should('not.exist');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_submit').should('be.disabled');
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
    cy.get('.MuiDialog-root .MuiAlert-message').invoke('text').should('contains', 'Feedback submitted successfully');
  });
  it('should be able to show feedback api response with status code 400', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 400 }).as('badRequest');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@badRequest');
    cy.get('.MuiDialog-root .MuiAlert-message').invoke('text').should('contains', 'Bad Request');
  });
  it('should be able to show feedback api response with status code 422', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 422 }).as('unprocessableEntry');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@unprocessableEntry');
    cy.get('.MuiDialog-root .MuiAlert-message').invoke('text').should('contains', 'Unprocessable Entry');
  });
  it('should be able to show feedback api response with status code 500', () => {
    cy.intercept('POST', feedbackUrl, { statusCode: 500 }).as('serverError');
    cy.getByTestId('feedback_submit').click();
    cy.wait('@serverError');
    cy.get('.MuiDialog-root .MuiAlert-message').invoke('text').should('contains', 'Internal Server Error');
  });
});
