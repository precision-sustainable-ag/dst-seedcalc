// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18';
import dstTheme from '../../src/shared/themes';

Cypress.Commands.add('mount', (component) => mount(
  <ThemeProvider theme={dstTheme}>
    {component}
  </ThemeProvider>,
));

// Example use:
// cy.mount(<MyComponent />)
