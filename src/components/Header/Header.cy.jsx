/* eslint-disable cypress/no-unnecessary-waiting */
import React from 'react';
import Header from './index';
import store from '../../store';

describe('<Header />', () => {
  beforeEach(() => {
    cy.mount(<Header />);
  });

  it('should PSA logo defaultly', () => {
    cy.getByTestId('header_logo').should('have.attr', 'src', './PSALogo.png');
  });

  it('should MCCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'MCCC' } });
    cy.getByTestId('header_logo').should('have.attr', 'src', './mccc-logo.png');
  });

  it('should NECCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'NECCC' } });
    cy.getByTestId('header_logo').should('have.attr', 'src', './neccc-logo.png');
  });

  it('should SCCC based on council', () => {
    store.dispatch({ type: 'siteCondition/updateCouncil', payload: { council: 'SCCC' } });
    cy.getByTestId('header_logo').should('have.attr', 'src', './sccc_logo.png');
  });

  it('should show the navbar', () => {
    cy.getByTestId('open_menu').should('be.visible');
  });
});
