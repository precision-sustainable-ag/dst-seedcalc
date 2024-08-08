import { mockSiteCondition, mockSpeciesSelection } from '../support/utils';
import { seedDataUnits } from '../../src/shared/data/units';

describe('Mix Ratios', () => {
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text').should('not.equal', '0');
  });

  // TODO: test with multiple species
  // TODO: test with NECCC and SCCC species

  it('should automatically open accordion if only one species is selected', () => {
    cy.getByTestId(`accordion-${selectSpecies}`).should('have.class', 'Mui-expanded');
  });

  it('should be able to switch unit while update value', () => {
    cy.getByTestId('unit_sqft').should('have.class', 'MuiButton-outlined');
    cy.getByTestId('unit_acre').should('have.class', 'MuiButton-contained');
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-label`)
      .should('contain.text', 'Acre');
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text')
      .then((value) => {
        cy.log(value);
        cy.getByTestId('unit_sqft').click();
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-label`)
          .should('contain.text', 'Sqft');
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
          .invoke('text').should('be.equal', (Math.round((value / 43560) * 1000000) / 1000).toString());
        cy.getByTestId('unit_acre').click();
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
          .invoke('text').should('be.equal', value);
      });
  });

  it('should be able to view or hide calculations', () => {
    cy.getByTestId('seeds_per_acre').should('not.exist');
    cy.getByTestId('show_calculation_button').click();
    cy.getByTestId('seeds_per_acre').should('be.visible');
  });

  it.only('should be able to update calculation when adjust values from scoller', { scrollBehavior: 'center' }, () => {
    cy.updateSlider('slider_percent_of_rate', 65);
  });
});
