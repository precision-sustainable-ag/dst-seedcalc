/* eslint-disable cypress/no-unnecessary-waiting */
import {
  mockMixRatio, mockSeedingMethod, mockSeedTagInfo, mockSpeciesSelection,
} from '../support/utils';
import { seedDataUnits } from '../../src/shared/data/units';

describe('Review Mix', () => {
  let selectSpecies;

  beforeEach(() => {
    cy.mockSiteCondition().then(() => {
      // eslint-disable-next-line prefer-destructuring
      selectSpecies = Cypress.env('selectCrops')[0];
      mockSpeciesSelection();
      mockMixRatio();
      mockSeedingMethod();
      mockMixRatio();
      mockSeedTagInfo();
      cy.getByTestId(`accordion-${selectSpecies}`).click();
    });
  });

  it('should be able to navigate the bar chart using next and back buttons', () => {
    cy.getByTestId('barchart_next').eq(0).click();
    cy.get('.recharts-responsive-container').eq(0).find('path').eq(0)
      .should('have.css', 'fill', 'rgb(79, 95, 48)');
    cy.get('.recharts-responsive-container').eq(0).find('path').eq(1)
      .should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.getByTestId('barchart_back').eq(0).click();
    cy.get('.recharts-responsive-container').eq(0).find('path').eq(0)
      .should('have.css', 'fill', 'rgb(152, 251, 152)');
    cy.get('.recharts-responsive-container').eq(0).find('path').eq(1)
      .should('have.css', 'fill', 'rgb(79, 95, 48)');
  });

  it('should be able to switch the unit while update value', () => {
    cy.getByTestId('unit_sqft').should('have.class', 'MuiButton-outlined');
    cy.getByTestId('unit_acre').should('have.class', 'MuiButton-contained');
    cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-label`)
      .eq(0).should('contain.text', 'Acre');
    cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
      .eq(0).find('p').invoke('text')
      .then((value) => {
        cy.log(value);
        cy.getByTestId('unit_sqft').eq(0).click();
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-label`)
          .eq(0).should('contain.text', 'Sqft');
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
          .eq(0).invoke('text').should('be.equal', (Math.round((value / 43560) * 1000000) / 1000).toString());
        cy.getByTestId('unit_acre').eq(0).click();
        cy.getByTestId(`${seedDataUnits.pureLiveSeed}-${seedDataUnits.seedingRate}-value`)
          .eq(0).invoke('text').should('be.equal', value);
      });
  });

  it('should be able to open the calculation', () => {
    cy.getByTestId('adjustment_from_seeding_method').should('not.exist');
    cy.getByTestId('change_my_rate_button').eq(0).click();
    cy.getByTestId('adjustment_from_seeding_method').should('be.visible');
  });

  it.only('should be able to update the calculation', () => {
    cy.getByTestId('change_my_rate_button').eq(0).click();

    cy.getByTestId('seeding_method_selection').click();
    cy.getByTestId('seeding_method_selection-Aerial').click();
    cy.getByTestId('seeding_method_selection').find('input').should('have.value', 'Aerial');

    cy.updateSlider('percent_slider', 100);
    cy.updateSlider('percent_slider', 50);
    cy.getByTestId('percent_rate').find('input').invoke('val').should('be.equal', (50).toString());
    cy.getByTestId('single_rate').find('input').invoke('val')
      .then((val1) => {
        cy.getByTestId('mix_rate').find('input').invoke('val')
          .then((val2) => {
            cy.log(val2, val1, Math.abs(val2 - val1 * 0.5));
            expect(Math.abs(val2 - val1 * 0.5)).to.be.lessThan(0.1);
          });
      });

    cy.updateSlider('purity_slider', 100);
    cy.updateSlider('germination_slider', 100);
    cy.updateSlider('germination_slider', 50);
    cy.getByTestId('germination_value').find('input').should('have.value', (50).toString());
    cy.getByTestId('purity_value').find('input').should('have.value', (100).toString());
    cy.getByTestId('seeding_rate_in_mix').find('input').invoke('val')
      .then((val1) => {
        cy.getByTestId('bulk_seeding_rate').find('input').invoke('val')
          .then((val2) => {
            cy.log(val2, val1, Math.abs(val2 - val1 / 0.5));
            expect(Math.abs(val2 - val1 / 0.5)).to.be.lessThan(0.1);
          });
      });

    cy.updateSlider('germination_slider', 100);
    cy.updateSlider('purity_slider', 50);
    cy.getByTestId('germination_value').find('input').should('have.value', (100).toString());
    cy.getByTestId('purity_value').find('input').should('have.value', (50).toString());
    cy.getByTestId('seeding_rate_in_mix').find('input').invoke('val')
      .then((val1) => {
        cy.getByTestId('bulk_seeding_rate').find('input').invoke('val')
          .then((val2) => {
            cy.log(val2, val1, Math.abs(val2 - val1 / 0.5));
            expect(Math.abs(val2 - val1 / 0.5)).to.be.lessThan(0.1);
          });
      });
  });
});

describe('Review Mix NECCC & SCCC', () => {
  it('should work in NECCC', () => {
    cy.mockSiteCondition('NECCC').then(() => {
      const selectSpecies = Cypress.env('selectCrops');
      mockSpeciesSelection('NECCC');
      mockMixRatio('NECCC');
      mockSeedingMethod();
      mockMixRatio();
      mockSeedTagInfo();
      selectSpecies.forEach((species) => {
        cy.getByTestId(`accordion-${species}`).click();
      });
      cy.getByTestId('change_my_rate_button').eq(0).click();
    });
  });

  // it('should work in SCCC', () => {
  //   cy.mockSiteCondition('SCCC').then(() => {
  //     const selectSpecies = Cypress.env('selectCrops');
  //     mockSpeciesSelection('SCCC');
  //     mockMixRatio('SCCC');
  //     mockSeedingMethod();
  //     mockMixRatio();
  //     mockSeedTagInfo();
  //     selectSpecies.forEach((species) => {
  //       cy.getByTestId(`accordion-${species}`).click();
  //     });
  //     cy.getByTestId('change_my_rate_button').eq(0).click();
  //   });
  // });
});
