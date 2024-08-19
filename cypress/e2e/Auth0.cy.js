describe('auth0', () => {
  beforeEach(() => {
    cy.loginToAuth0();
    cy.visit('/');
  });

  it('shoule be able to login', () => {

  });
});
