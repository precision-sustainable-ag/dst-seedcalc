import React from 'react';
import DSTImport from './index';

describe('<DSTImport />', () => {
  beforeEach(() => {
    cy.mount(<DSTImport />);
  });
  it('should only show an option to import from csv file when not logged in', () => {
    cy.getByTestId('import_button').click();
    cy.getByTestId('import_from_csv').should('be.visible');
    cy.getByTestId('import_from_csv').click();
  });
});
