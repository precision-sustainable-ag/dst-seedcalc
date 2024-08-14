import React from 'react';
import DSTTextField from './index';

describe('<DSTTextField />', () => {
  it('should trigger onChange when input', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(<DSTTextField handleChange={onChangeSpy} testId="text_field" />);
    cy.getByTestId('text_field').type('1');
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should be disabled when given disabled props', () => {
    cy.mount(<DSTTextField disabled testId="text_field" />);
    cy.getByTestId('text_field').find('input').should('have.class', 'Mui-disabled');
  });
});
