import React from 'react';
import NumberTextField from './index';

describe('<NumberTextField />', () => {
  it('should trigger onChange when input', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(<NumberTextField value={0} onChange={onChangeSpy} testId="text_field" />);
    cy.getByTestId('text_field').type('1');
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should be disabled if set disabled props to true', () => {
    cy.mount(<NumberTextField value={0} disabled testId="text_field" />);
    cy.getByTestId('text_field').find('input').should('have.class', 'Mui-disabled');
  });

  it('should show warning message when input invalid values', () => {
    cy.mount(<NumberTextField value={0} testId="text_field" />);
    cy.getByTestId('text_field').type('a');
    cy.get('.MuiFormHelperText-root').invoke('text').should('contains', 'Invalid Value!');
  });

  it('should auto format value over 1000 when blur and remove format when focus', () => {
    cy.mount(<NumberTextField value={0} onChange={() => {}} testId="text_field" />);
    cy.getByTestId('text_field').type('1000000');
    cy.getByTestId('text_field').find('input').blur();
    cy.getByTestId('text_field').find('input').should('have.value', '1,000,000');
    cy.getByTestId('text_field').find('input').focus();
    cy.getByTestId('text_field').find('input').should('have.value', '1000000');
  });
});
