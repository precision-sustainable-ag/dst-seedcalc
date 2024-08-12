import { mockSiteCondition, mockSpeciesSelection } from '../support/utils';
import { seedDataUnits } from '../../src/shared/data/units';

describe('Mix Ratios single species selection', () => {
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    const selectType = 'Brassica';
    const species = 'Radish, Daikon';
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${species}`).find('button').click();
    cy.getByTestId('next_button').click();

    cy.getByTestId(`${species}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text').should('not.equal', '0');
  });

  it('should automatically open accordion if only one species is selected', () => {
    cy.getByTestId(`accordion-${selectSpecies}`).should('have.class', 'Mui-expanded');
  });
});

describe('Mix Ratios', () => {
  // const selectSpecies = ['Radish, Daikon', 'Rapeseed'];
  const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    cy.getByTestId(`accordion-${selectSpecies}`).click();
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text').should('not.equal', '0');
  });

  // TODO: test with NECCC and SCCC species

  it('should be able to switch unit while update value', () => {
    cy.getByTestId('unit_sqft').should('have.class', 'MuiButton-outlined');
    cy.getByTestId('unit_acre').should('have.class', 'MuiButton-contained');
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-label`)
      .should('contain.text', 'Acre');
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text')
      .then((value) => {
        cy.log(value);
        cy.getByTestId('unit_sqft').eq(0).click();
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-label`)
          .should('contain.text', 'Sqft');
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
          .invoke('text').should('be.equal', (Math.round((value / 43560) * 1000000) / 1000).toString());
        cy.getByTestId('unit_acre').eq(0).click();
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
          .invoke('text').should('be.equal', value);
      });
  });

  it('should be able to view or hide calculations', () => {
    cy.getByTestId('seeds_per_acre').should('not.exist');
    cy.getByTestId(`${selectSpecies}-show_calculation_button`).click();
    cy.getByTestId('seeds_per_acre').should('be.visible');
  });

  it('should be able to update calculation when adjust values from scoller', () => {
    cy.updateSlider(`${selectSpecies}-slider_percent_of_rate`, 100);
    cy.getByTestId(`${selectSpecies}-slider_percent_of_rate`).find('input').should('have.value', 100);
    cy.updateSlider(`${selectSpecies}-slider_percent_of_rate`, 50);
    cy.getByTestId(`${selectSpecies}-slider_percent_of_rate`).find('input').should('have.value', 50);
    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`).find('p').invoke('text')
      .then((val1) => {
        cy.getByTestId(`${selectSpecies}-${seedDataUnits.seedingRateinMix}-value`).find('p').invoke('text')
          .then((val2) => {
            cy.log(val2, val1, Math.abs(val2 - val1 * 0.5));
            expect(Math.abs(val2 - val1 * 0.5)).to.be.lessThan(0.1);
          });
      });
  });
});
