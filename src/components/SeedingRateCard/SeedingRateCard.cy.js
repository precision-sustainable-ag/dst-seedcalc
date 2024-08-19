import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store';
import SeedingRateCard from './index';

describe('<SeedingRateCard />', () => {
  const seedingRateLabel = 'Pure Live Seed';
  const seedingRateValue = 1.49;
  const plantValue = 244181.2;
  const seedValue = 287272;

  beforeEach(() => {
    cy.mount(
      <Provider store={store}>
        <SeedingRateCard
          seedingRateLabel={seedingRateLabel}
          seedingRateValue={seedingRateValue}
          plantValue={plantValue}
          seedValue={seedValue}
        />
      </Provider>,
    );
  });
  it('should show correct seeding rate value and label', () => {
    cy.get('.MuiBox-root').find('p').eq(0).invoke('text')
      .should('equal', seedingRateValue.toString());
    cy.get('.MuiBox-root').find('p').eq(1).invoke('text')
      .should('equal', '244,200');
    cy.get('.MuiBox-root').find('p').eq(2).invoke('text')
      .should('equal', '287,300');
  });
});
