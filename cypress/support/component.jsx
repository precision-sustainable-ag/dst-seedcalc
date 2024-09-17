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
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Auth0ProviderWithNavigate from '../../src/components/Auth/Auth0ProviderWithNavigate';
import store from '../../src/store';
import dstTheme from '../../src/shared/themes';

Cypress.Commands.add('mount', (component) => mount(
  <Provider store={store}>
    <ThemeProvider theme={dstTheme}>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          {component}
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
));

// Example use:
// cy.mount(<MyComponent />)
