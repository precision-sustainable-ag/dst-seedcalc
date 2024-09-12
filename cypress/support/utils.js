export const clickStateMap = (council) => {
  cy.visit('/');
  cy.get('.mapboxgl-canvas').should('be.visible');
  cy.get('div[class^="map_loadingContainer"]', { timeout: 10000 }).should('not.exist');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  if (council === undefined) {
    // click on Indiana
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 160);
  } else if (council === 'NECCC') {
    // click on Pennsylvania
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 620, 150);
  } else if (council === 'SCCC') {
    // click on NC
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 600, 220);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const mockSiteCondition = (council) => {
  clickStateMap(council);
  cy.getByTestId('option_manually').should('be.visible').click();
  cy.getByTestId('site_condition_region').click();
  if (council === undefined) cy.get('[data-test="option-Adams"]').click();
  else if (council === 'NECCC') cy.get('[data-test="option-Zone 6"]').click();
  else if (council === 'SCCC') cy.get('[data-test="option-Zone 7"]').click();
  cy.getByTestId('site_condition_soil_drainage').click();
  cy.get('[data-test="option-Poorly Drained"]').click();
  cy.getByTestId('site_condition_acres').find('input').type('1');
  if (council === undefined) {
    cy.getByTestId('check_nrcs').click();
  }
  if (council === 'NECCC') {
    cy.getByTestId('site_condition_soil_fertility').click();
    cy.get('[data-test="option-Low"]').click();
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
