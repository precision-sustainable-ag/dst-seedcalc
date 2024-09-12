import React from 'react';
import DSTSwitch from './index';

describe('DSTSwitch', () => {
  it('should be initially unchecked', () => {
    cy.mount(<DSTSwitch checked={false} testId="dst_switch" />);
    cy.getByTestId('dst_switch').should('not.be.checked');
  });

  it('should toggle state when clicked', () => {
    cy.mount(<DSTSwitch testId="dst_switch" />);

    cy.getByTestId('dst_switch').click();
    cy.getByTestId('dst_switch').should('have.class', 'Mui-checked');
    cy.getByTestId('dst_switch').click();
    cy.getByTestId('dst_switch').should('not.have.class', 'Mui-checked');
  });

  it('should trigger handleChange when clicked', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(<DSTSwitch handleChange={onChangeSpy} testId="dst_switch" />);
    cy.getByTestId('dst_switch').click();
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should be disabled if diabled prop is true', () => {
    cy.mount(<DSTSwitch disabled testId="dst_switch" />);
    cy.getByTestId('dst_switch').find('input').should('be.disabled');
  });
});
