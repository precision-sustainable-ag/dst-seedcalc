import React from 'react';
import DSTBarChart from './index';

const calculatorResult = {
  Rapeseed: {
    step1: {
      singleSpeciesSeedingRate: 2.5,
      percentOfRate: 0.5,
      seedingRate: 1.25,
    },
    step2: {
      seedingRate: 1.25,
      plantingMethodModifier: 1,
      seedingRateAfterPlantingMethodModifier: 1.25,
    },
    step3: {
      seedingRate: 1.25,
      managementImpactOnMix: 1,
      seedingRateAfterManagementImpact: 1.25,
    },
    step4: {
      seedingRateAfterManagementImpact: 1.25,
      germination: 0.85,
      purity: 0.9,
      bulkSeedingRate: 1.63,
    },
    step5: {
      bulkSeedingRate: 1.63,
      acres: 1,
      poundsForPurchase: 1.63,
    },
  },
};

const seed = { label: 'Rapeseed' };

describe('<DSTBarChart />', () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.mount(<DSTBarChart seed={seed} calculatorResult={calculatorResult} />);
  });

  it('should render the barchart, button set and list', () => {
    cy.get('.recharts-label').eq(0).find('tspan').invoke('text')
      .should('equals', '2.5');
    cy.get('.recharts-label').eq(1).find('tspan').invoke('text')
      .should('equals', '1.25');
    cy.get('.recharts-label').eq(2).find('tspan').invoke('text')
      .should('equals', '1.25');
    cy.get('.recharts-label').eq(3).find('tspan').invoke('text')
      .should('equals', '1.25');
    cy.get('.recharts-label').eq(4).find('tspan').invoke('text')
      .should('equals', '1.63');
    cy.getByTestId('barchart_back').should('be.visible');
    cy.getByTestId('barchart_next').should('be.visible');
    cy.getByTestId('list_container').should('be.visible');
  });

  it('should control the barchart using button set', () => {
    cy.get('.recharts-rectangle').eq(0).should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.get('.recharts-rectangle').eq(1).should('have.css', 'fill', 'rgb(79, 95, 48)');
    cy.getByTestId('barchart_next').click();
    cy.get('.recharts-rectangle').eq(0).should('have.css', 'fill', 'rgb(79, 95, 48)');
    cy.get('.recharts-rectangle').eq(1).should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.getByTestId('barchart_back').click();
    cy.get('.recharts-rectangle').eq(0).should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.get('.recharts-rectangle').eq(1).should('have.css', 'fill', 'rgb(79, 95, 48)');
  });

  it('shows all barcharts on larger screen and only show one on smaller screen', () => {
    cy.get('.recharts-rectangle').should('have.length', 5);
    cy.viewport(500, 500);
    cy.get('.recharts-rectangle').should('have.length', 1);
  });
});
