import {
  mockMixRatio, mockReviewMix, mockSeedingMethod, mockSeedTagInfo, mockSiteCondition, mockSpeciesSelection,
} from '../support/utils';

describe('Seed Tag Info', () => {
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
    mockSeedingMethod();
    mockMixRatio();
    mockSeedTagInfo();
    mockReviewMix();
  });

  it('should be able to export a csv file', () => {
    cy.getByTestId('export_button').click();
    cy.getByTestId('export_csv').should('be.visible');
    cy.getByTestId('export_csv').click();
    cy.readFile('./cypress/downloads/data_MCCC.csv').should('exist');
  });

  it('should be able to update the calculation', () => {
    cy.getByTestId(`${selectSpecies}-acres`).clear();
    cy.getByTestId(`${selectSpecies}-acres`).type(2);
    cy.getByTestId(`${selectSpecies}-bulk-seeding-rate`)
      .find('input').invoke('val').then((val) => {
        cy.getByTestId(`${selectSpecies}-total-pounds`)
          .find('input').invoke('val').should('be.equal', (val * 2).toString());
      });

    cy.getByTestId(`${selectSpecies}-cost-per-pound`).clear();
    cy.getByTestId(`${selectSpecies}-cost-per-pound`).type(1);
    cy.getByTestId(`${selectSpecies}-total-cost`)
      .find('input').invoke('val').then((val) => {
        cy.getByTestId(`${selectSpecies}-total-pounds`)
          .find('input').invoke('val').should('be.equal', (val * 1).toString());
      });
  });
});
