export const clickStateMap = (council) => {
  cy.intercept({ url: 'https://api.mapbox.com/**' }, { log: false });
  cy.intercept({ url: 'https://events.mapbox.com/**' }, { log: false });
  cy.visit('/');
  cy.get('.mapboxgl-canvas').should('be.visible');

  if (council === undefined) {
    cy.get('div[class^="_wrapper"]').reactComponent().its('memoizedProps').then((props) => {
      cy.wrap(props).invoke('selectorFunction', { properties: { STATE_NAME: 'Indiana' } });
    });
  } else if (council === 'NECCC') {
    cy.get('div[class^="_wrapper"]').reactComponent().its('memoizedProps').then((props) => {
      cy.wrap(props).invoke('selectorFunction', { properties: { STATE_NAME: 'New York' } });
    });
  } else if (council === 'SCCC') {
    cy.get('div[class^="_wrapper"]').reactComponent().its('memoizedProps').then((props) => {
      cy.wrap(props).invoke('selectorFunction', { properties: { STATE_NAME: 'North Carolina' } });
    });
  }
};

// eslint-disable-next-line import/prefer-default-export
export const mockSiteCondition = (council) => {
  clickStateMap(council);
  cy.getByTestId('option_manually').should('be.visible').click();
  cy.getByTestId('site_condition_region').click();
  if (council === undefined) cy.get('[data-test="site_condition_region-Adams"]').click();
  else if (council === 'NECCC') cy.get('[data-test="site_condition_region-Zone 6"]').click();
  else if (council === 'SCCC') cy.get('[data-test="site_condition_region-Zone 7"]').click();
  cy.getByTestId('site_condition_soil_drainage').click();
  cy.get('[data-test="site_condition_soil_drainage-Poorly Drained"]').click();
  cy.getByTestId('site_condition_acres').find('input').type('1');
  if (council === undefined) {
    cy.getByTestId('check_nrcs').click();
  }
  if (council === 'NECCC') {
    cy.getByTestId('site_condition_soil_fertility').click();
    cy.get('[data-test="site_condition_soil_fertility-Low"]').click();
  }
  cy.getByTestId('next_button').click();
};

export const mockSpeciesSelection = (council) => {
  let selectType;
  let selectSpecies;
  if (council === undefined) {
    selectType = 'Brassica';
    selectSpecies = ['Radish, Daikon', 'Rapeseed'];
  } else if (council === 'NECCC') {
    selectType = 'Brassica';
    selectSpecies = ['Brassica, Forage', 'Mustard'];
  } else if (council === 'SCCC') {
    selectType = 'Grass';
    selectSpecies = ['Millet, Japanese', 'Sorghum-sudangrass'];
  }
  cy.getByTestId(`accordion-${selectType}`).click();
  selectSpecies.forEach((species) => {
    cy.getByTestId(`species-card-${species}`).find('button').click();
    cy.getByTestId(`species-card-${species}`).find('img')
      .should('have.css', 'border-width', '6px')
      .and('have.css', 'border-style', 'solid')
      .and('have.css', 'border-color', 'rgb(89, 146, 230)');
    cy.getByTestId(`species-card-${species}`).parent().children()
      .get('[data-testid="CheckRoundedIcon"]')
      .should('be.visible');
  });
  cy.getByTestId('next_button').click();
};

export const mockMixRatio = () => {
  cy.getByTestId('next_button').click();
};

export const mockSeedingMethod = () => {
  cy.getByTestId('next_button').click();
};

export const mockMixSeedingRate = () => {
  cy.getByTestId('next_button').click();
};

export const mockSeedTagInfo = () => {
  cy.getByTestId('selection_yes').click();
  cy.getByTestId('next_button').click();
};

export const mockReviewMix = () => {
  cy.getByTestId('next_button').click();
};

export const mockConfirmPlan = () => {
  cy.getByTestId('next_button').click();
};
