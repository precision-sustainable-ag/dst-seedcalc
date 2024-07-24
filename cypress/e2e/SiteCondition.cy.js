describe('Site Condition landing page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the header and logo of the app', () => {
    cy.getByTestId('header_logo').should('be.visible');
    cy.getByTestId('page_caption').should('be.visible').and('contain', 'Seeding Rate Calculator');
  });

  it('diable the next step button defaultly', () => {
    cy.getByTestId('next_button').should('be.disabled');
  });

  it('shows the options of use map or edit manually after click a state on map', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    // click on Indiana
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 160);
    cy.getByTestId('option_map').should('be.visible');
    cy.getByTestId('option_manually').should('be.visible');
  });
});

describe('Site Condition form', () => {
  beforeEach(() => {
    cy.visit('/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    // click on Indiana
    cy.get('.mapboxgl-canvas').should('be.visible').trigger('click', 525, 160);
    cy.getByTestId('option_manually').should('be.visible').click();
  });

  it('will only have state and planting date filled if select manually enter', () => {
    cy.getByTestId('site_condition_state').find('input').should('have.value', 'Indiana');
    cy.getByTestId('site_condition_region').find('input').should('have.value', '');
    cy.getByTestId('site_condition_soil_drainage').find('input').should('have.value', '');
    cy.getByTestId('site_condition_acres').find('input').should('have.value', '0');
  });

  it('will show tile drainage information if related value is selected', () => {
    cy.getByTestId('site_condition_tile_drainage').should('not.exist');
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="option-Poorly Drained"]').click();
    cy.getByTestId('site_condition_tile_drainage').should('be.visible');
    cy.get('[data-test="option-Well Drained"]').click();
    cy.getByTestId('site_condition_tile_drainage').should('not.exist');
  });

  it('will make the next step button available after input all required information', () => {
    cy.getByTestId('site_condition_region').click();
    cy.get('[data-test="option-Adams"]').click();
    cy.getByTestId('site_condition_soil_drainage').click();
    cy.get('[data-test="option-Poorly Drained"]').click();
    cy.getByTestId('site_condition_acres').find('input').type('1');
    cy.getByTestId('next_button').should('not.be.disabled');
  });
});
