// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import './utils';

Cypress.Commands.add('getByTestId', (testId, ...args) => cy.get(`[data-test="${testId}"]`, ...args));

Cypress.Commands.add('reactComponent', { prevSubject: 'element' }, ($el) => {
  if ($el.length !== 1) {
    throw new Error(`cy.component() requires element of length 1 but got ${$el.length}`);
  }
  // Query for key starting with __reactInternalInstance$ for React v16.x
  //
  // eslint-disable-next-line no-shadow
  const key = Object.keys($el.get(0)).find((key) => key.startsWith('__reactFiber$'));

  // @ts-ignore
  const domFiber = $el.prop(key);

  Cypress.log({
    name: 'component',
    consoleProps() {
      return {
        component: domFiber,
      };
    },
  });

  return domFiber.return;
});

Cypress.Commands.add('updateSlider', (testId, value) => {
  cy.getByTestId(testId).reactComponent()
    .its('memoizedProps.ownerState').then((state) => {
      cy.wrap(state).invoke('onChange', null, value);
    });
  cy.getByTestId(testId).find('.MuiSlider-thumb')
    .click();
});

Cypress.Commands.add('loginToAuth0', () => {
  const args = { username: Cypress.env('auth0_username'), password: Cypress.env('auth0_password') };
  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating | ${args.username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot('before');

  cy.session(
    `auth0-${args.username}`,
    () => {
      // App landing page redirects to Auth0.
      cy.visit('/');
      cy.getByTestId('auth_button').click();

      // Login on Auth0.
      cy.origin(Cypress.env('auth0_domain'), { args }, ({ username, password }) => {
        cy.get('input#username').type(username);
        cy.get('input#password').type(password);
        cy.contains('button[value=default]', 'Continue').click();
      });

      // Ensure Auth0 has redirected us back to the RWA.
      cy.url().should('equal', Cypress.config().baseUrl);
    },
  );

  log.snapshot('after');
  log.end();
});

Cypress.Commands.add('getReduxState', () => cy.window().its('store').invoke('getState'));
