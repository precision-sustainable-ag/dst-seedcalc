import React from 'react';
import { Provider } from 'react-redux';
import HistoryDialog from './index';
import store from '../../store';

describe('<HistoryDialog />', () => {
  beforeEach(() => {
    cy.mount(
      <Provider store={store}>
        <HistoryDialog />
      </Provider>,
    );
    // store.dispatch({ type: 'user/setHistoryDialogState', payload: { open: true, type: 'add' } });
  });

  it('should show a dialog for adding calculation', () => {
    store.dispatch({ type: 'user/setHistoryDialogState', payload: { open: true, type: 'add' } });
    cy.getByTestId('dialog_title').invoke('text').should('equal', 'Are you creating a new record?');
    cy.getByTestId('input_calculation_name').should('be.visible');
    cy.getByTestId('warning_text').should('not.exist');
    cy.getByTestId('create_button').should('be.visible');
    cy.getByTestId('create_record_button').should('not.exist');
  });

  it('should show a dialog for warning to update calculation', () => {
    store.dispatch({ type: 'user/setHistoryDialogState', payload: { open: true, type: 'update' } });
    cy.getByTestId('dialog_title').invoke('text').should('equal', 'Are you updating your record?');
    cy.getByTestId('input_calculation_name').should('not.exist');
    cy.getByTestId('warning_text').should('be.visible');
    cy.getByTestId('create_button').should('not.exist');
    cy.getByTestId('create_record_button').should('be.visible');
  });

  it.only('should have validation for adding new calculations', () => {
    store.dispatch({
      type: 'user/setUserHistoryList',
      payload: {
        userHistoryList: [{ label: '1' }],
      },
    });
    store.dispatch({ type: 'user/setHistoryDialogState', payload: { open: true, type: 'add' } });
    cy.getByTestId('create_button').click();
    cy.getByTestId('input_calculation_name').find('label').should('have.class', 'Mui-error');
    cy.getByTestId('input_calculation_name').type(1);
    cy.getByTestId('create_button').click();
    cy.getByTestId('input_calculation_name').find('label').should('have.class', 'Mui-error');
    cy.getByTestId('input_calculation_name').type(2);
    cy.getByTestId('create_button').click();
    cy.getByTestId('input_calculation_name').should('not.exist');
  });
});
