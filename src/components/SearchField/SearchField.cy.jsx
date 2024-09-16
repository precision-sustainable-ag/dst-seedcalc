import React from 'react';
import SearchField from './index';

describe('<SearchField />', () => {
  it('should trigger the onChange when input', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(<SearchField handleChange={onChangeSpy} testId="search_field" />);
    cy.getByTestId('search_field').type('1');
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });
});
