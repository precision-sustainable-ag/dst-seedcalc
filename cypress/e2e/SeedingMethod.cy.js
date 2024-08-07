import { mockMixRatio, mockSiteCondition, mockSpeciesSelection } from '../support/utils';

describe('Seeding Method', () => {
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
  });

  it('should contain default method as drilled', () => {
    const defaultMethod = 'Drilled';
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', defaultMethod);
    cy.getByTestId(`accordion-${selectSpecies}`).click();
    cy.getByTestId(`method-${defaultMethod}`)
      .should('have.css', 'border-width', '2px')
      .and('have.css', 'border-style', 'solid')
      .and('have.css', 'border-color', 'rgb(79, 95, 48)');
  });

  it('should be able to update the seeding method', () => {
    const selectMethod = 'Aerial';
    cy.getByTestId('seeding_method_dropdown').click();
    cy.getByTestId(`option-${selectMethod}`).click();
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', selectMethod);
    cy.getByTestId(`accordion-${selectSpecies}`).click();
    cy.getByTestId(`method-${selectMethod}`)
      .should('have.css', 'border-width', '2px')
      .and('have.css', 'border-style', 'solid')
      .and('have.css', 'border-color', 'rgb(79, 95, 48)');
  });
});
