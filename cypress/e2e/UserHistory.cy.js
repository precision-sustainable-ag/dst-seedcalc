describe('Creating user history', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://develophistory.covercrop-data.org/v1/history', {
      statusCode: 200,
      body: {
        data: { id: 0 },
      },
    }).as('createHistory');

    cy.intercept('POST', 'https://develophistory.covercrop-data.org/v1/history/*', {
      statusCode: 200,
      body: {},
    }).as('updateHistory');

    cy.loginToAuth0();
    cy.visit('/');
  });

  it.only('should be able to create a history', () => {
    cy.getByTestId('import_button').click();
    cy.getByTestId('create_calculation').click();
    cy.getByTestId('input_calculation_name').type('cyTest');
    cy.getByTestId('create_button').click();
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('new');
    });

    cy.get('.mapboxgl-canvas').should('be.visible');
    cy.get('div[class^="map_loadingContainer"]').should('not.exist');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    // click on Indiana
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 160);
    cy.getByTestId('option_manually').should('be.visible').click();
    cy.getByTestId('site_condition_region').click();
    cy.get('[data-test="option-Adams"]').click();
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="option-Poorly Drained"]').click();
    cy.getByTestId('site_condition_acres').find('input').type('1');
    cy.getByTestId('next_button').click();

    cy.wait('@createHistory').its('response.statusCode').should('equal', 200);

    // historyState should be still new after creating history
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('new');
    });
  });

  it('should be able to create a history', () => {});
});
