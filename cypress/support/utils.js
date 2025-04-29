import './commands';

export const selectMapState = (council) => {
  cy.intercept({ url: 'https://api.mapbox.com/**' }, { log: false });
  cy.intercept({ url: 'https://events.mapbox.com/**' }, { log: false });
  cy.visit('/');

  cy.getByTestId('site_condition_state').click();
  if (council === undefined) {
    cy.get('[data-test="site_condition_state-Indiana"]').click();
    cy.getByTestId('site_condition_state').find('input').should('have.value', 'Indiana');
  } else if (council === 'NECCC') {
    cy.get('[data-test="site_condition_state-New York"]').click();
    cy.getByTestId('site_condition_state').find('input').should('have.value', 'New York');
  } else if (council === 'SCCC') {
    cy.get('[data-test="site_condition_state-North Carolina"]').click();
    cy.getByTestId('site_condition_state').find('input').should('have.value', 'North Carolina');
  }
};

Cypress.Commands.add('mockSiteCondition', (council) => {
  cy.intercept('GET', '**/v2/crops/?regions=**&context=seed_calc').as('getCropsData');
  selectMapState(council);
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
  cy.wait('@getCropsData').then((interception) => {
    const { data } = interception.response.body;
    if (data.length < 2) throw new Error('Less than 2 crops available!');
    const selectCrops = [data[0].label, data[1].label];
    const selectTypes = [data[0].group.label, data[1].group.label];
    Cypress.env('selectCrops', selectCrops);
    Cypress.env('selectTypes', selectTypes);
    Cypress.env('cropsData', data);
    cy.log(selectCrops, selectTypes);
  });
  cy.getByTestId('next_button').click();
});

export const mockSpeciesSelection = () => {
  const selectTypes = Cypress.env('selectTypes');
  const selectSpecies = Cypress.env('selectCrops');

  cy.getByTestId(`accordion-${selectTypes[0]}`).click();
  if (selectTypes[1] !== selectTypes[0]) cy.getByTestId(`accordion-${selectTypes[1]}`).click();

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
