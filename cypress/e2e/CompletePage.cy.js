import {
  mockConfirmPlan,
  mockMixRatio, mockReviewMix, mockSeedingMethod, mockSeedTagInfo, mockSiteCondition, mockSpeciesSelection,
} from '../support/utils';

describe('Seed Tag Info', () => {
  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
    mockSeedingMethod();
    mockMixRatio();
    mockSeedTagInfo();
    mockReviewMix();
    mockConfirmPlan();
  });

  it('should be able to restart the calculation', () => {
    cy.getByTestId('restart_button').click();
    cy.get('.mapboxgl-canvas').should('exist');
    cy.getByTestId('next_button').should('not.be.disabled');
  });

  it('should be able to navigate to feedback page', () => {
    cy.getByTestId('link_to_feedback').click();
    cy.url().should('contain', '/feedback');
  });
});
