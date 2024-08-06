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

  // it.only('should be able to update calculation when adjust values from scoller', { scrollBehavior: 'center' }, () => {
  //   cy.getByTestId('slider_percent_of_rate').then((slider) => {
  //     const boundingBox = slider[0].getBoundingClientRect();
  //     const { width } = boundingBox;
  //     const stepLength = width / 100;

  //     cy.wrap(slider).find('.MuiSlider-thumb').trigger('mousedown', { which: 1, force: true });
  //     // eslint-disable-next-line cypress/unsafe-to-chain-command
  //     cy.wrap(slider)
  //       .trigger('mousemove', { which: 1, pageX: boundingBox.right - 50 * stepLength, force: true })
  //       .trigger('mouseup');
  //   });

  //   // cy.getByTestId('slider_percent_of_rate').reactComponent()
  //   //   .its('memoizedProps.ownerState').then((state) => {
  //   //     cy.wrap(state).invoke('onChange', null, 50);
  //   //     // cy.wait(1000);
  //   //     // cy.wrap(state).invoke('onChangeCommitted');
  //   //   });
  //   // cy.getByTestId('slider_percent_of_rate').find('.MuiSlider-thumb')
  //   //   .trigger('mousedown').trigger('mouseup');

  //   // cy.getByTestId('slider_percent_of_rate');
  // });

  // it('mui slider tests', () => {
  //   cy.visit('https://mui.com/material-ui/react-slider/');
  //   // eslint-disable-next-line cypress/unsafe-to-chain-command
  //   // cy.get('.MuiSlider-root .MuiSlider-thumb').first().then((slider) => {
  //   //   cy.wrap(slider).trigger('mousedown', { which: 1, force: true })
  //   //     .trigger('mousemove', { which: 1, pageX: 546, force: true })
  //   //     .trigger('mouseup');
  //   // });

  //   cy.get('.MuiSlider-root').first().then((slider) => {
  //     const boundingBox = slider[0].getBoundingClientRect();
  //     const { width } = boundingBox;
  //     const stepLength = width / 100;

  //     cy.wrap(slider).click('left', 0);
  //   });

  //   // cy.get('.MuiSlider-root').first().reactComponent()
  //   //   .its('memoizedProps.ownerState')
  //   //   .then((state) => {
  //   //     cy.wrap(state).invoke('onChange', null, 50);
  //   //   });
  // });
});
