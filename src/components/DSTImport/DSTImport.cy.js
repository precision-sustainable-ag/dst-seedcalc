import React from 'react';
import { Provider } from 'react-redux';
import DSTImport from './index';
import store from '../../store';

describe('<DSTImport />', () => {
  beforeEach(() => {
    cy.mount(
      <Provider store={store}>
        <DSTImport />
      </Provider>,
    );
  });
  it('should only show an option to import from csv file when not logged in', () => {
    cy.getByTestId('import_button').click();
    cy.getByTestId('import_from_csv').should('be.visible');
    cy.getByTestId('import_from_csv').click();
  });
});
