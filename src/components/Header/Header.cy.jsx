/* eslint-disable cypress/no-unnecessary-waiting */
import React from 'react';
import Header from './index';
import store from '../../store';
import { releaseNotesUrl } from '../../shared/data/keys';

describe('<Header />', () => {
  beforeEach(() => {
    cy.mount(<Header />);
  });

  it('should PSA logo defaultly', () => {
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/PSA_logo.png');
  });

  it('should MCCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'MCCC' } });
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/mwccc_logo.png');
  });

  it('should NECCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'NECCC' } });
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/neccc_logo.png');
  });

  it('should SCCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'SCCC' } });
    cy.getByTestId('header_logo_button').find('img').should('have.attr', 'src', 'images/sccc_logo.png');
  });

  it('should show the navbar', () => {
    cy.getByTestId('open_menu').should('be.visible');
  });

  it('should render navbar as menu on larger screen and an icon on smaller screen', () => {
    cy.getByTestId('open_menu').should('be.visible');
    cy.viewport(1024, 768);
    cy.getByTestId('open_menu').should('not.exist');
  });

  it('should have available links', () => {
    cy.getByTestId('open_menu').click();

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.getByTestId('navbar-Release Notes').click();
    cy.get('@windowOpen').should('be.calledWith', releaseNotesUrl);

    cy.getByTestId('navbar-Feedback').click();
    cy.url().should('contain', '/feedback');
  });
});
