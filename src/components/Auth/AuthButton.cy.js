import React from 'react';
import AuthButton from './AuthButton';

describe('<AuthButton />', () => {
  const types = ['Login', 'Signup', 'Logout', ''];

  it('should render correct type of auth button', () => {
    types.forEach((type) => {
      cy.mount(<AuthButton type={type} />);
      cy.getByTestId('auth_button').find('p').invoke('text').should('equal', type);
    });
  });

  it('should call the onClick function when clicked', () => {
    const onChangeStub = cy.stub();
    cy.mount(<AuthButton type={types[3]} onClickCallback={onChangeStub} />);
    cy.getByTestId('auth_button').click();
    cy.wrap(onChangeStub).should('have.been.calledOnce');
  });
});
