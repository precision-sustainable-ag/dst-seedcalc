import { mockSiteCondition } from '../support/utils';

describe('Species Selection', () => {
  const selectType = 'Brassica';
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
  });

  // TODO: test with multiple crops and invalid crops

  it('should be able to click on species card to select or unselect a species', () => {
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('img')
      .should('have.css', 'border-width', '6px')
      .and('have.css', 'border-style', 'solid')
      .and('have.css', 'border-color', 'rgb(89, 146, 230)');
    cy.getByTestId(`species-card-${selectSpecies}`).parent().children()
      .get('[data-testid="CheckRoundedIcon"]')
      .should('be.visible');
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('img')
      .should('not.have.css', 'border-width', '6px')
      .and('not.have.css', 'border-color', 'rgb(89, 146, 230)');
    cy.getByTestId(`species-card-${selectSpecies}`).parent().children()
      .get('[data-testid="CheckRoundedIcon"]')
      .should('not.exist');
  });

  it('next button should be disabled at first, and be available after select >=1 species', () => {
    cy.getByTestId('next_button').should('be.disabled');
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId('next_button').should('not.be.disabled');
  });

  it('should be able to unselect a species by clicking on the sidebar', () => {
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId(`sidebar-${selectSpecies}`).should('be.visible');
    cy.getByTestId(`sidebar-${selectSpecies}`).find('button').click();
    cy.getByTestId(`sidebar-${selectSpecies}`).should('not.exist');
    cy.getByTestId(`species-card-${selectSpecies}`).find('img')
      .should('not.have.css', 'border-width', '6px')
      .and('not.have.css', 'border-color', 'rgb(89, 146, 230)');
    cy.getByTestId(`species-card-${selectSpecies}`).parent().children()
      .get('[data-testid="CheckRoundedIcon"]')
      .should('not.exist');
  });

  it.only('should be able to use the search field to search a species', () => {
    cy.getByTestId('species-selection-search').should('be.visible').type('Radish');
    cy.get('[data-test^="accordion-"]').should('have.class', 'Mui-expanded');
    cy.getByTestId(`accordion-${selectType}`).getByTestId(`species-card-${selectSpecies}`).should('be.visible');
    cy.get('[data-test^="accordion-"]').get('[data-test^="species-card-"]').should('have.length', 1);
  });
});
