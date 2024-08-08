describe('Site Condition landing page', () => {
  beforeEach(() => {
    cy.visit('/feedback');
  });

  it('should be return back to map if click back button', () => {
    cy.getByTestId('feedback_back').click();
    cy.url().should('equal', Cypress.config().baseUrl);
  });

  it.only('should not be available to submit until all fields are filled', () => {
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_title').type('title');
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_message').type('message');
    cy.getByTestId('feedback_alert').should('be.visible');
    cy.getByTestId('feedback_data').click();
    cy.getByTestId('feedback_alert').should('not.exist');
    cy.getByTestId('feedback_submit').should('not.be.disabled');
  });
});
