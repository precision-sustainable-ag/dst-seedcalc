import React from 'react';
import { Provider } from 'react-redux';
import SeedsSelectedList from './index';
import store from '../../store';
import rapeseed from '../../../cypress/fixtures/Rapeseed.json';
import turnip from '../../../cypress/fixtures/Turnip, Forage.json';

describe('<SeedsSelectedList />', () => {
  const selectedSpecies = ['Rapeseed', 'Turnip, Forage'];
  before(() => {
    store.dispatch({ type: 'calculator/addSeed', payload: { seed: rapeseed } });
    store.dispatch({ type: 'calculator/addSeed', payload: { seed: turnip } });
  });
  it('should show selected species', () => {
    cy.mount(
      <Provider store={store}>
        <SeedsSelectedList />
      </Provider>,
    );
    selectedSpecies.forEach((species) => {
      cy.getByTestId(`sidebar-${species}`).should('be.visible');
    });
  });

  it('should trigger selectSidebarSeed when click on any species', () => {
    const dispatchStub = cy.stub();
    store.dispatch = dispatchStub;
    cy.mount(
      <Provider store={store}>
        <SeedsSelectedList />
      </Provider>,
    );
    cy.getByTestId('sidebar-Rapeseed').click();
    cy.wrap(dispatchStub).should('have.been.calledWith', {
      type: 'calculator/selectSidebarSeed',
      payload: {
        seed: 'Rapeseed',
      },
    });
  });

  it('should trigger removeSeed when click on any species on step 1', () => {
    const dispatchStub = cy.stub();
    store.dispatch = dispatchStub;
    cy.mount(
      <Provider store={store}>
        <SeedsSelectedList activeStep={1} />
      </Provider>,
    );
    cy.getByTestId('sidebar-Rapeseed').click();
    cy.wrap(dispatchStub).should(
      'have.been.calledWith',
      {
        type: 'calculator/removeSeed',
        payload: {
          seedName: 'Rapeseed',
        },
      },
    );
  });
});
