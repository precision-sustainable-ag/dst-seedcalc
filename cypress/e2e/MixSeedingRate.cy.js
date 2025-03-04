import {
  mockMixRatio, mockSeedingMethod, mockSpeciesSelection,
} from '../support/utils';

describe('Mix Seeding Rate', () => {
  beforeEach(() => {
    cy.mockSiteCondition().then(() => {
      mockSpeciesSelection();
      mockMixRatio();
      mockSeedingMethod();
    });
  });

  it('should be able to change value', () => {
    cy.getByTestId('seeding_rate_slider').click('top');
    cy.getByTestId('seeding_rate_slider').find('input').invoke('val').then((val) => {
      cy.getByTestId('max_value').invoke('text').should('equal', val);
    });
    cy.getByTestId('seeding_rate_slider').click('bottom');
    cy.getByTestId('seeding_rate_slider').find('input').invoke('val').then((val) => {
      cy.getByTestId('min_value').invoke('text').should('equal', val);
    });
  });
});
