import {
  mockConfirmPlan, mockMixRatio, mockReviewMix, mockSeedingMethod, mockSeedTagInfo, mockSpeciesSelection,
} from '../support/utils';

describe('Seed Tag Info', () => {
  beforeEach(() => {
    cy.mockSiteCondition().then(() => {
      mockSpeciesSelection();
      mockMixRatio();
      mockSeedingMethod();
      mockMixRatio();
      mockSeedTagInfo();
      mockReviewMix();
      mockConfirmPlan();
    });
  });

  it('should be able to restart the calculation', () => {
    cy.getByTestId('restart_button').first().click();
    cy.get('.mapboxgl-canvas').should('exist');
    cy.getByTestId('next_button').first().should('not.be.disabled');
  });

  it('should be able to navigate to feedback page', () => {
    cy.getByTestId('link_to_feedback').click();
    cy.url().should('contain', '/feedback');
  });
});
