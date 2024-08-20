import React from 'react';
import NavBar from './index';
import { releaseNotesUrl } from '../../shared/data/keys';

describe('<NavBar />', () => {
  beforeEach(() => {
    cy.mount(<NavBar />);
  });
  it('should be rendered as menu on larger screen and an icon on smaller screen', () => {
    cy.getByTestId('open_menu').should('be.visible');
    cy.viewport(1024, 768);
    cy.getByTestId('open_menu').should('not.exist');
  });

  it('should have available links', () => {
    cy.getByTestId('open_menu').click();

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.getByTestId('release_notes').click();
    cy.get('@windowOpen').should('be.calledWith', releaseNotesUrl);

    cy.getByTestId('feedback').click();
    cy.url().should('contain', '/feedback');
  });
});
