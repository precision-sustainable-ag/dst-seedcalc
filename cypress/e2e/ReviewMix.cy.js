import {
  mockMixRatio, mockSeedingMethod, mockSeedTagInfo, mockSiteCondition, mockSpeciesSelection,
} from '../support/utils';
import { seedDataUnits } from '../../src/shared/data/units';

describe('Seed Tag Info', () => {
  // const selectSpecies = 'Radish, Daikon';

  beforeEach(() => {
    mockSiteCondition();
    mockSpeciesSelection();
    mockMixRatio();
    mockSeedingMethod();
    mockMixRatio();
    mockSeedTagInfo();
  });

  it('should be able to navigate the bar chart using next and back buttons', () => {
    cy.getByTestId('barchart_next').click();
    cy.get('.recharts-responsive-container').find('path').eq(0).should('have.css', 'fill', 'rgb(79, 95, 48)');
    cy.get('.recharts-responsive-container').find('path').eq(1).should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.getByTestId('barchart_back').click();
    cy.get('.recharts-responsive-container').find('path').eq(0).should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.get('.recharts-responsive-container').find('path').eq(1).should('have.css', 'fill', 'rgb(79, 95, 48)');
  });

  it('should be able to switch the unit while update value', () => {
    cy.getByTestId('unit_sqft').should('have.class', 'MuiButton-outlined');
    cy.getByTestId('unit_acre').should('have.class', 'MuiButton-contained');
    cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-label`)
      .should('contain.text', 'Acre');
    cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
      .find('p').invoke('text')
      .then((value) => {
        cy.log(value);
        cy.getByTestId('unit_sqft').click();
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-label`)
          .should('contain.text', 'Sqft');
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
          .invoke('text').should('be.equal', (Math.round((value / 43560) * 1000000) / 1000).toString());
        cy.getByTestId('unit_acre').click();
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
          .invoke('text').should('be.equal', value);
      });
  });

  it('should be able to open the calculation', () => {
    cy.getByTestId('adjustment_from_seeding_method').should('not.exist');
    cy.getByTestId('change_my_rate_button').click();
    cy.getByTestId('adjustment_from_seeding_method').should('be.visible');
  });

  it.only('should be able to update the calculation', () => {
    cy.getByTestId('change_my_rate_button').click();

    cy.getByTestId('seeding_method_selection').click();
    cy.getByTestId('option-Aerial').click();
    cy.getByTestId('seeding_method_selection').find('input').should('have.value', 'Aerial');

    // cy.getByTestId('percent_slider').click('center');
    // cy.getByTestId('germination_slider').click('center');
    // cy.getByTestId('purity_slider').click('center');
  });
});
