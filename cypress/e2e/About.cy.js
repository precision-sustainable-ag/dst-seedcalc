import { clickStateMap } from '../support/utils';

describe('Feedback', () => {
  beforeEach(() => {
    cy.visit('/about');
  });

  it('should show the license part text', () => {
    cy.getByTestId('section-License and Copyright').should('be.visible');
  });

  it('should show different attribution text based on selected council', () => {
    cy.getByTestId('about_attribution').should('include.text', 'We, MCCC, NECCC, SCCC, ');
    clickStateMap();
    cy.getByTestId('navbar-About').click();
    cy.getByTestId('about_attribution').should('include.text', 'Midwestern Cover Crops Species Selector Data');
    clickStateMap('NECCC');
    cy.getByTestId('navbar-About').click();
    cy.getByTestId('about_attribution').should('include.text', 'Northeastern Cover Crops Species Selector Data');
    clickStateMap('SCCC');
    cy.getByTestId('navbar-About').click();
    cy.getByTestId('about_attribution').should('include.text', 'Southern Cover Crops Species Selector Data');
  });

  it('should return back to site condition page when click the logo', () => {
    cy.getByTestId('header_logo_button').click();
    cy.url().should('be.equal', Cypress.config('baseUrl'));
  });
});
