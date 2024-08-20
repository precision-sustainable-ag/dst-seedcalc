describe('Creating user history', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://develophistory.covercrop-data.org/v1/history', {
      statusCode: 200, body: { data: { id: 0 } },
    }).as('createHistory');
    cy.loginToAuth0();
    cy.visit('/');
  });

  it('should be able to create a history', () => {
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
});

describe('Importing user history', () => {
  beforeEach(() => {
    cy.intercept('https://develophistory.covercrop-data.org/v1/histories?schema=*').as('getHistory');
    cy.loginToAuth0();
    cy.visit('/');
  });

  it('should be able to import a history', () => {
    cy.getByTestId('import_button').click();
    cy.getByTestId('select_calculation').click();
    cy.getByTestId('option-10').click();
    cy.getByTestId('import_calculation').click();
    cy.wait('@getHistory');
    cy.wait(1000);
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('imported');
    });
  });
});

describe('Updating user history', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://develophistory.covercrop-data.org/v1/history/*', {
      statusCode: 200,
      body: {},
    }).as('updateHistory');

    cy.intercept('https://develophistory.covercrop-data.org/v1/histories?schema=*').as('getHistory');

    cy.loginToAuth0();
    cy.visit('/');
  });

  it('should not be able to update history on site condition', () => {
    cy.getByTestId('import_button').click();
    cy.getByTestId('select_calculation').click();
    cy.getByTestId('option-10').click();
    cy.getByTestId('import_calculation').click();
    cy.wait('@getHistory');
    cy.wait(1000);
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('imported');
    });
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 200);
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('option_manually').click();
    cy.getByTestId('site_condition_state').click();
    cy.get('[data-test="option-Alabama"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('site_condition_region').click();
    cy.get('[data-test="option-Adams"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="option-Poorly Drained"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
  });

  it.only('should be able to update a history on the rest steps', () => {

  });
});
