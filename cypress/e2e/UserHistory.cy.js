/* eslint-disable cypress/no-unnecessary-waiting */
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
    // select Indiana
    cy.getByTestId('site_condition_state').click();
    cy.get('[data-test="site_condition_state-Indiana"]').click();
    cy.getByTestId('option_manually').should('be.visible').click();
    cy.getByTestId('site_condition_region').click();
    cy.get('[data-test="site_condition_region-Adams"]').click();
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="site_condition_soil_drainage-Poorly Drained"]').click();
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
    cy.getByTestId('select_calculation-10').click();
    cy.getByTestId('import_calculation').click();
    cy.wait('@getHistory').wait(1000);
    // history state should be imported
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('imported');
    });
  });
});

describe('Updating user history', () => {
  beforeEach(() => {
    cy.intercept('PUT', 'https://develophistory.covercrop-data.org/v1/history/*', {
      statusCode: 200,
      body: {},
    }).as('updateHistory');

    cy.intercept('https://develophistory.covercrop-data.org/v1/histories?schema=*').as('getHistory');

    cy.loginToAuth0();
    cy.visit('/');
  });

  it('should not be able to update history on site condition', () => {
    // import history 10
    cy.getByTestId('import_button').click();
    cy.getByTestId('select_calculation').click();
    cy.getByTestId('select_calculation-10').click();
    cy.getByTestId('import_calculation').click();
    cy.wait('@getHistory').wait(1000);
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('imported');
    });
    // should not be able to update state to New York
    cy.getByTestId('site_condition_state').click();
    cy.get('[data-test="site_condition_state-New York"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('option_manually').click();
    // should not be able to update forms
    cy.getByTestId('site_condition_state').click();
    cy.get('[data-test="site_condition_state-Alabama"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('site_condition_region').click();
    cy.get('[data-test="site_condition_region-Adams"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="site_condition_soil_drainage-Poorly Drained"]').click();
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('cancel_button').click();
  });

  it('should be able to update history on the rest steps', () => {
    // import history 10
    cy.getByTestId('import_button').click();
    cy.getByTestId('select_calculation').click();
    cy.getByTestId('select_calculation-10').click();
    cy.getByTestId('import_calculation').click();
    cy.getByTestId('next_button').click();
    // remove a species on step 2
    cy.getByTestId('sidebar-Turnip, Forage').click();
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('updated');
    });
    cy.getByTestId('next_button').click();
    // updatehistory should be called and history state should be reset to imported
    cy.wait('@updateHistory').wait(1000);
    cy.getReduxState().then((state) => {
      const { historyState } = state.user;
      cy.log(historyState);
      expect(historyState).to.equal('imported');
    });
  });
});
