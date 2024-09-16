import React from 'react';
import DSTPieChart from './index';

const chartData = [
  {
    name: 'Turnip, Forage',
    value: 1.9477124183006536,
  },
  {
    name: 'Rapeseed',
    value: 1.6339869281045751,
  },
];

const label = 'Pounds of Seed per Acre';

describe('<DSTPieChart />', () => {
  it('should render correct data and label', () => {
    cy.mount(<DSTPieChart chartData={chartData} label={label} />);
    cy.get('.recharts-sector').should('have.length', 2);
    cy.get('.recharts-pie-labels').find('text').eq(0).invoke('text')
      .should('equal', '54.4%');
    cy.get('.recharts-pie-labels').find('text').eq(1).invoke('text')
      .should('equal', '45.6%');
    cy.getByTestId('piechart_label').eq(0).invoke('text').should('equal', 'Turnip, Forage');
    cy.getByTestId('piechart_label').eq(1).invoke('text').should('equal', 'Rapeseed');
    cy.getByTestId('piechart_value').eq(0).invoke('text').should('equal', '1.95');
    cy.getByTestId('piechart_value').eq(1).invoke('text').should('equal', '1.63');
  });
});
