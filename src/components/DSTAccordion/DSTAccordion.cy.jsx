import React from 'react';
import DSTAccordion from './index';

describe('<DSTAccordion />', () => {
  beforeEach(() => {
    cy.mount(<DSTAccordion />);
  });

  it('should render the accordion with given title', () => {
    cy.mount(<DSTAccordion summary="Accordion Title" />);
    cy.getByTestId('accordion_summary').find('.MuiAccordionSummary-content')
      .should('contain.text', 'Accordion Title');
  });

  it('should trigger the onChange function when clicked', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(<DSTAccordion onChange={onChangeSpy} />);
    cy.getByTestId('accordion_summary').click();
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should expand or collapse the accordion when clicked', () => {
    cy.mount(<DSTAccordion />);
    cy.getByTestId('accordion_details').should('not.be.visible');
    cy.getByTestId('accordion_summary').click();
    cy.getByTestId('accordion_details').should('be.visible');
    cy.getByTestId('accordion_summary').click();
    cy.getByTestId('accordion_details').should('not.be.visible');
  });
});
