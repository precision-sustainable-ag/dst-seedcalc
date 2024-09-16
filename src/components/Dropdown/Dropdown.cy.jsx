import React from 'react';
import Dropdown from './index';
import { plantHardinessZone } from '../../shared/data/dropdown';

describe('<Dropdown />', () => {
  it('should shows a list of options when click', () => {
    cy.mount(<Dropdown items={plantHardinessZone} testId="dropdown" />);
    cy.getByTestId('dropdown').click();
    cy.get('.MuiList-root').should('be.visible');
  });

  it('should show the selected list item', () => {
    cy.mount(<Dropdown items={plantHardinessZone} testId="dropdown" />);
    cy.getByTestId('dropdown').click();
    cy.getByTestId('option-Zone 1').click();
    cy.getByTestId('dropdown').find('input').should('have.value', 'Zone 1');
  });

  it('shows empty warning if statement is met', () => {
    cy.mount(<Dropdown items={plantHardinessZone} emptyWarning testId="dropdown" />);
    cy.get('.MuiOutlinedInput-notchedOutline').should('have.css', 'borderColor', 'rgba(255, 0, 0, 0.5)');
  });
});
