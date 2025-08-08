import React from 'react';
import StepsList from './index';
import { completedList, calculatorList } from '../../shared/data/dropdown';

describe('<StepsList />', () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.mount(<StepsList availableSteps={completedList} activeStep={0} />);
  });
  it('should show all steps and labels in order on larger screen', () => {
    calculatorList.forEach((step, i) => {
      cy.get('.MuiStepLabel-label').eq(i).invoke('text').should('equal', step);
    });
  });

  it('should show current step', () => {
    cy.mount(<StepsList activeStep={3} availableSteps={completedList} />);
    cy.getByTestId(`step-${3}`).should('have.attr', 'aria-current', 'step');
  });

  it('should be able to navigate to a step by clicking on that step', () => {
    const mockSetStep = cy.stub();
    cy.mount(<StepsList activeStep={3} setActiveStep={mockSetStep} availableSteps={completedList} />);
    cy.getByTestId(`step-${0}`).click();
    cy.wrap(mockSetStep).should('have.been.calledOnce');
  });
});
