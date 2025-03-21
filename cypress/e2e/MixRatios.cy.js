import { mockSpeciesSelection } from '../support/utils';
import { seedDataUnits } from '../../src/shared/data/units';

describe('Mix Ratios single species selection', () => {
  beforeEach(() => {
    cy.mockSiteCondition();
  });

  it('should automatically open accordion if only one species is selected', () => {
    const selectType = Cypress.env('selectTypes')[0];
    const selectSpecies = Cypress.env('selectCrops')[0];
    cy.getByTestId(`accordion-${selectType}`).click();
    cy.getByTestId(`species-card-${selectSpecies}`).find('button').click();
    cy.getByTestId('next_button').click();

    cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
      .find('p').invoke('text').should('not.equal', '0');
    cy.getByTestId(`accordion-${selectSpecies}`).should('have.class', 'Mui-expanded');
  });
});

describe('Mix Ratios', () => {
  let selectSpecies;
  beforeEach(() => {
    cy.mockSiteCondition().then(() => {
      mockSpeciesSelection();
      // eslint-disable-next-line prefer-destructuring
      selectSpecies = Cypress.env('selectCrops')[0];
      cy.getByTestId(`accordion-${selectSpecies}`).click();
      cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
        .find('p').invoke('text').should('not.equal', '0');
    });
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

describe('Mix Ratios NECCC & SCCC', () => {
  it('should only have scroller for percent of single species rate in NECCC', () => {
    cy.mockSiteCondition('NECCC').then(() => {
      const selectSpecies = Cypress.env('selectCrops')[0];
      mockSpeciesSelection('NECCC');
      cy.getByTestId(`accordion-${selectSpecies}`).click();
      cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
        .find('p').invoke('text').should('not.equal', '0');
      cy.get(`[data-test*="${selectSpecies}-slider"]`).should('have.length', 1);
    });
  });

  // it('should have 2 scrollers in SCCC', () => {
  //   cy.mockSiteCondition('SCCC').then(() => {
  //     const selectSpecies = Cypress.env('selectCrops')[0];
  //     mockSpeciesSelection('SCCC');
  //     cy.getByTestId(`accordion-${selectSpecies}`).click();
  //     cy.getByTestId(`${selectSpecies}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`)
  //       .find('p').invoke('text').should('not.equal', '0');
  //     cy.get(`[data-test*="${selectSpecies}-slider_single_species_seeding_rate"]`).should('be.visible');
  //     cy.get(`[data-test*="${selectSpecies}-slider_percent_of_rate"]`).should('be.visible');
  //   });
  // });
});
