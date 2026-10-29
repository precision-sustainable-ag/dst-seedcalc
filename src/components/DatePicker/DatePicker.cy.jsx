import React from 'react';
import dayjs from 'dayjs';
import DatePicker from './index';

describe('<DatePicker />', () => {
  it('should open the date picker when clicking on the calendar button', () => {
    cy.mount(<DatePicker />);
    cy.get('[aria-label="Choose date"]').click();
    cy.get('.MuiDateCalendar-root').should('be.visible');
  });

  it('should be showing current date by default', () => {
    cy.mount(<DatePicker />);
    cy.get('.MuiPickersInputBase-input').should('have.value', dayjs(new Date()).format('MM/DD/YYYY'));
  });

  it('should be able to select a date and trigger onChange function', () => {
    const onChangeStub = cy.stub();
    cy.mount(<DatePicker handleChange={onChangeStub} />);
    cy.get('[aria-label="Choose date"]').click();
    cy.get('.MuiPickerDay-root').contains('10').click();
    cy.wrap(onChangeStub).should('have.been.calledOnce');
  });
});
