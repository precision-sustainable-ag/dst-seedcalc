import {
  mockMixRatio, mockSeedingMethod, mockSiteCondition, mockSpeciesSelection,
} from '../support/utils';

describe('Seed Tag Info', () => {
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
    mockSeedingMethod();
    mockMixRatio();
  });

  it('should not be able to click next before make selection', () => {
    cy.getByTestId('next_button').should('be.disabled');
    cy.getByTestId('selection_yes').click();
    cy.getByTestId('next_button').should('not.be.disabled');
  });

  it.only('should be able to update value after make selection', () => {
    const testValue = 50;
    cy.getByTestId('selection_yes').click();
    cy.getByTestId(`${selectSpecies}-germination`).find('input').clear();
    cy.getByTestId(`${selectSpecies}-germination`).type(testValue);
    cy.getByTestId(`${selectSpecies}-germination`).find('input').should('have.value', '50');
    cy.getByTestId(`${selectSpecies}-purity`).find('input').clear();
    cy.getByTestId(`${selectSpecies}-purity`).type(testValue);
    cy.getByTestId(`${selectSpecies}-purity`).find('input').should('have.value', '50');
    cy.getByTestId(`${selectSpecies}-seedsPerPound`).find('input').clear();
    cy.getByTestId(`${selectSpecies}-seedsPerPound`).type(10000);
    cy.getByTestId(`${selectSpecies}-seedsPerPound`).find('input').should('have.value', '10000');
  });
});
