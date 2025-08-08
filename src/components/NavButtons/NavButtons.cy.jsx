import React from 'react';
import NavButtons from './NavButtons';
import { completedList } from '../../shared/data/dropdown';
import stepCaptions from '../../shared/data/stepCaption';

describe('<StepsList />', () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.mount(<NavButtons availableSteps={completedList} activeStep={0} />);
  });

  it('should trigger the setStep function using next and back button', () => {
    const mockSetStep = cy.stub();
    cy.mount(<NavButtons activeStep={3} setActiveStep={mockSetStep} availableSteps={completedList} />);
    cy.getByTestId('next_button').click();
    cy.wrap(mockSetStep).should('have.been.calledOnce');
    cy.getByTestId('back_button').click();
    cy.wrap(mockSetStep).should('have.been.calledTwice');
  });

  it('should show current step caption when shown in top', () => {
    cy.mount(<NavButtons activeStep={3} availableSteps={completedList} />);
    cy.getByTestId('step_caption').invoke('text').should('equal', stepCaptions[3]);
  });

  it('should show restart link when shown in bottom and able to trigger restart functions when clicked', () => {
    const mockSetStep = cy.stub();
    const mockSetSiteConditionStep = cy.stub();
    cy.mount(
      <NavButtons
        activeStep={3}
        setActiveStep={mockSetStep}
        setSiteConditionStep={mockSetSiteConditionStep}
        availableSteps={completedList}
        placement="bottom"
      />,
    );
    cy.getByTestId('restart_link').should('exist').click();
    cy.wrap(mockSetStep).should('have.been.calledWith', 0);
    cy.wrap(mockSetSiteConditionStep).should('have.been.calledWith', 1);
  });

  it('should show restart button on the last step and should trigger restart when clicked', () => {
    const mockSetStep = cy.stub();
    const mockSetSiteConditionStep = cy.stub();
    cy.mount(
      <NavButtons
        activeStep={8}
        setActiveStep={mockSetStep}
        setSiteConditionStep={mockSetSiteConditionStep}
        availableSteps={completedList}
      />,
    );
    cy.getByTestId('restart_button').should('exist').click();
    cy.wrap(mockSetStep).should('have.been.calledWith', 0);
    cy.wrap(mockSetSiteConditionStep).should('have.been.calledWith', 1);
  });

  it('should have restrictions on some steps', () => {
    cy.mount(<NavButtons activeStep={0} availableSteps={completedList} />);
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please enter the necessary info below.');
    cy.mount(<NavButtons activeStep={1} availableSteps={completedList} />);
    cy.getByTestId('next_button').click({ force: true });
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please select at least 1 plant.');
    cy.mount(<NavButtons activeStep={5} availableSteps={completedList} />);
    cy.getByTestId('next_button').click({ force: true });
    cy.get('.MuiTooltip-tooltip').invoke('text').should('equal', 'Please make a selection.');
  });
});
