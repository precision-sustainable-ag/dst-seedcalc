/* eslint-disable prefer-destructuring */
import { mockSiteCondition } from '../support/utils';

describe('Species Selection', () => {
  beforeEach(() => {
    mockSiteCondition();
  });

  it('should be able to click on species card to select or unselect a species', () => {
    const selectType = Cypress.env('selectTypes')[0];
    const selectSpecies = Cypress.env('selectCrops')[0];
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
    const selectType = Cypress.env('selectTypes')[0];
    const selectSpecies = Cypress.env('selectCrops')[0];
    cy.getByTestId('next_button').should('be.disabled');
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId('next_button').should('not.be.disabled');
  });

  it('should be able to unselect a species by clicking on the sidebar', () => {
    const selectType = Cypress.env('selectTypes')[0];
    const selectSpecies = Cypress.env('selectCrops')[0];
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

  it('should be able to use the search field to search a species', () => {
    const selectType = Cypress.env('selectTypes')[0];
    const selectSpecies = Cypress.env('selectCrops')[0];
    cy.getByTestId('species-selection-search').should('be.visible').type(selectSpecies);
    cy.get('[data-test^="accordion-"]').should('have.class', 'Mui-expanded');
    cy.getByTestId(`accordion-${selectType}`).getByTestId(`species-card-${selectSpecies}`).should('be.visible');
    cy.get('[data-test^="accordion-"]').get('[data-test^="species-card-"]').should('have.length', 1);
  });

  it.only('should show the diversity bar with ratio of species', () => {
    const selectTypes = Cypress.env('selectTypes');
    const selectSpecies = Cypress.env('selectCrops');
    cy.getByTestId(`accordion-${selectTypes[0]}`).click();
    if (selectTypes[1] !== selectTypes[0]) cy.getByTestId(`accordion-${selectTypes[1]}`).click();

    selectSpecies.forEach((species) => {
      cy.getByTestId(`species-card-${species}`).find('button').click();
    });

    if (selectTypes[0] !== selectTypes[1]) {
      cy.getByTestId(`diversity-${selectTypes[0]}`).should('have.css', 'flex-grow', '1');
      cy.getByTestId(`diversity-${selectTypes[1]}`).should('have.css', 'flex-grow', '1');
    } else {
      cy.getByTestId(`diversity-${selectTypes[0]}`).should('have.css', 'flex-grow', '2');
    }
  });
});

describe('Species Selection NECCC', () => {
  beforeEach(() => {
    mockSiteCondition('NECCC');
  });

  it('should be able to select species for NECCC', () => {
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
  });
});

describe('Species Selection SCCC', () => {
  beforeEach(() => {
    mockSiteCondition('SCCC');
  });

  it('should work for SCCC', () => {
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
  });
});
