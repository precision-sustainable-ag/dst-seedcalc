import {
  mockMixRatio, mockMixSeedingRate, mockSeedingMethod, mockSpeciesSelection,
} from '../support/utils';

describe('Seed Tag Info', () => {
  let selectSpecies;

  beforeEach(() => {
    cy.mockSiteCondition().then(() => {
      // eslint-disable-next-line prefer-destructuring
      selectSpecies = Cypress.env('selectCrops')[0];
      mockSpeciesSelection();
      mockMixRatio();
      mockSeedingMethod();
      mockMixSeedingRate();
    });
  });

  it('should not be able to click next before make selection', () => {
    cy.getByTestId('next_button').should('be.disabled');
    cy.getByTestId('selection_yes').click();
    cy.getByTestId('next_button').should('not.be.disabled');
  });

  it('should be able to update value after make selection', () => {
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

describe('Seed Tag Info NECCC & SCCC', () => {
  it('should work in NECCC', () => {
    cy.mockSiteCondition('NECCC').then(() => {
      mockSpeciesSelection('NECCC');
      mockMixRatio('NECCC');
      mockSeedingMethod();
      mockMixSeedingRate();
      cy.getByTestId('selection_no').click();
    });
  });

  // it('should work in SCCC', () => {
  //   cy.mockSiteCondition('SCCC').then(() => {
  //     mockSpeciesSelection('SCCC');
  //     mockMixRatio('SCCC');
  //     mockSeedingMethod();
  //     mockMixSeedingRate();
  //     cy.getByTestId('selection_no').click();
  //   });
  // });
});
