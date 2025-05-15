const testAuth0Env = process.env.VITE_TEST_AUTH0_ENV;

describe('auth0', () => {
  beforeEach(function () {
    if (testAuth0Env) {
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
