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
