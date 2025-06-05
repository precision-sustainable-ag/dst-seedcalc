describe('auth0', () => {
  beforeEach(function () {
    if (Cypress.env('test_auth0_env')) {
      this.skip();
    }
    cy.loginToAuth0();
    cy.visit('/');
  });

  it('shoule show logout button and import calculation from history after login', () => {
    cy.getByTestId('auth_button').find('p').invoke('text').should('equal', 'LOGOUT');
    cy.getByTestId('import_button').click();
    cy.getByTestId('create_calculation').should('be.visible');
    cy.getByTestId('import_calculation').should('be.visible');
  });
});
