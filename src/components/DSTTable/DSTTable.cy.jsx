import React from 'react';
import DSTTable from './index';

const rows = [
  {
    label: 'Rapeseed',
    result: 1.63,
    expect: '1.25 ≤ result ≤ 6.25',
    pass: 'passed',
  },
  {
    label: 'Turnip, Forage',
    result: 1.95,
    expect: '1.49 ≤ result ≤ 7.45',
    pass: 'passed',
  },
];

const cells = ['label', 'result', 'expect', 'pass'];

describe('<DSTTable />', () => {
  it('should renders the table correctly', () => {
    cy.mount(<DSTTable rows={rows} cells={cells} />);
    cells.forEach((cell) => {
      cy.getByTestId(`head-${cell}`).should('be.visible');
    });
    rows.forEach((row) => {
      Object.keys(row).forEach((r) => {
        cy.getByTestId(row[r]).should('be.visible');
      });
    });
  });
});
