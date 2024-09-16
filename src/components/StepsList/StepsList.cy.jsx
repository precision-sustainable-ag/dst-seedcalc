import React from 'react';
import StepsList from './index';
import { completedList, calculatorList } from '../../shared/data/dropdown';

describe('<StepsList />', () => {
  beforeEach(() => {
    cy.mount(<StepsList availableSteps={completedList} activeStep={0} />);
  });
  it('should show all steps and labels in order on larger screen', () => {
    cy.viewport(1024, 768);
    calculatorList.forEach((step, i) => {
      cy.get('.MuiStepLabel-label').eq(i).invoke('text').should('equal', step);
    });
  });

  it('should trigger the setStep function using next and back button', () => {
    const mockSetStep = cy.stub();
    cy.mount(<StepsList activeStep={3} setActiveStep={mockSetStep} availableSteps={completedList} />);
    cy.getByTestId('next_button').click();
    cy.wrap(mockSetStep).should('have.been.calledOnce');
    cy.getByTestId('back_button').click();
    cy.wrap(mockSetStep).should('have.been.calledTwice');
  });

  it('should show current step', () => {
    cy.mount(<StepsList activeStep={3} availableSteps={completedList} />);
    cy.getByTestId(`step-${3}`).find('.MuiStepIcon-root').should('have.css', 'color', 'rgb(119, 180, 0)');
  });

  it('should be able to navigate to a step by clicking on that step', () => {
    const mockSetStep = cy.stub();
    cy.mount(<StepsList activeStep={3} setActiveStep={mockSetStep} availableSteps={completedList} />);
    cy.getByTestId(`step-${0}`).click();
    cy.wrap(mockSetStep).should('have.been.calledOnce');
  });

  it('should have restrictions on some steps', () => {
    cy.mount(<StepsList activeStep={0} availableSteps={completedList} />);
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please enter the necessary info below.');
    cy.mount(<StepsList activeStep={1} availableSteps={completedList} />);
    cy.getByTestId('next_button').click({ force: true });
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please select at least 1 plant.');
    cy.mount(<StepsList activeStep={5} availableSteps={completedList} />);
    cy.getByTestId('next_button').click({ force: true });
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please make a selection.');
  });
});
