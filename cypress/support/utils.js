export const clickStateMap = () => {
  cy.visit('/');
  cy.get('.mapboxgl-canvas').should('be.visible');
  cy.get('div[class^="map_loadingContainer"]').should('not.exist');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  // click on Indiana
  cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 160);
};

// eslint-disable-next-line import/prefer-default-export
export const mockSiteCondition = () => {
  clickStateMap();
  cy.getByTestId('option_manually').should('be.visible').click();
  cy.getByTestId('site_condition_region').click();
  cy.get('[data-test="option-Adams"]').click();
  cy.getByTestId('site_condition_soil_drainage').click();
  cy.get('[data-test="option-Poorly Drained"]').click();
  cy.getByTestId('site_condition_acres').find('input').type('1');
  cy.getByTestId('next_button').click();
};

export const mockSpeciesSelection = () => {
  const selectType = 'Brassica';
  const selectSpecies = 'Radish, Daikon';
  cy.getByTestId(`accordion-${selectType}`).click();
  cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
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
