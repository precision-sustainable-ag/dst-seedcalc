import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthButton from './AuthButton';
import Auth0ProviderWithNavigate from './Auth0ProviderWithNavigate';

describe('<AuthButton />', () => {
  const types = ['Login', 'Signup', 'Logout', ''];

  it('should render correct type of auth button', () => {
    types.forEach((type) => {
      cy.mount(
        <BrowserRouter>
          <Auth0ProviderWithNavigate>
            <AuthButton type={type} />
          </Auth0ProviderWithNavigate>
        </BrowserRouter>,
      );
      cy.getByTestId('auth_button').find('p').invoke('text').should('equal', type);
    });
  });

  it('should call the onClick function when clicked', () => {
    const onChangeStub = cy.stub();
    cy.mount(
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <AuthButton type={types[3]} onClickCallback={onChangeStub} />
        </Auth0ProviderWithNavigate>
      </BrowserRouter>,
    );
    cy.getByTestId('auth_button').click();
    cy.wrap(onChangeStub).should('have.been.calledOnce');
  });
});
