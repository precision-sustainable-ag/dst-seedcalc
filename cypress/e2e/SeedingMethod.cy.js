import { mockMixRatio, mockSiteCondition, mockSpeciesSelection } from '../support/utils';

describe('Seeding Method', () => {
  const selectSpecies = ['Radish, Daikon', 'Rapeseed'];

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
  });

  it('should contain default method as drilled', () => {
    const defaultMethod = 'Drilled';
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', defaultMethod);
    selectSpecies.forEach(() => {
      cy.getByTestId(`method-${defaultMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
  });

  it('should be able to update the seeding method', () => {
    const selectMethod = 'Aerial';
    cy.getByTestId('seeding_method_dropdown').click();
    cy.getByTestId(`option-${selectMethod}`).click();
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', selectMethod);
    selectSpecies.forEach(() => {
      cy.getByTestId(`method-${selectMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
  });
});

describe('Seeding Method NECCC & SCCC', () => {
  it('should work in NECCC', () => {
    const selectSpecies = ['Brassica, Forage', 'Mustard'];
    mockSiteCondition('NECCC');
    mockSpeciesSelection('NECCC');
    mockMixRatio();
    const defaultMethod = 'Drilled';
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', defaultMethod);
    selectSpecies.forEach((species) => {
      cy.getByTestId(`accordion-${species}`).click();
      cy.getByTestId(`method-${defaultMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
    const selectMethod = 'Aerial';
    cy.getByTestId('seeding_method_dropdown').click();
    cy.getByTestId(`option-${selectMethod}`).click();
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', selectMethod);
    selectSpecies.forEach(() => {
      cy.getByTestId(`method-${selectMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
  });

  it('should work in SCCC', () => {
    const selectSpecies = ['Millet, Japanese', 'Sorghum-sudangrass'];
    mockSiteCondition('SCCC');
    mockSpeciesSelection('SCCC');
    mockMixRatio();
    const defaultMethod = 'Drilled';
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', defaultMethod);
    selectSpecies.forEach((species) => {
      cy.getByTestId(`accordion-${species}`).click();
      cy.getByTestId(`method-${defaultMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
    const selectMethod = 'Broadcast(With No Cultivation)';
    cy.getByTestId('seeding_method_dropdown').click();
    cy.getByTestId(`option-${selectMethod}`).click();
    cy.getByTestId('seeding_method_dropdown').find('input').should('have.value', selectMethod);
    selectSpecies.forEach(() => {
      cy.getByTestId(`method-${selectMethod}`)
        .should('have.css', 'border-width', '2px')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(79, 95, 48)');
    });
  });
});