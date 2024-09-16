import { defineConfig } from 'cypress';
import coverageTask from "@cypress/code-coverage/task.js";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    experimentalRunAllSpecs: true,
    trashAssetsBeforeRuns: true,
    setupNodeEvents(on, config) {

      coverageTask(on, config);
      return config;

      // require('@cypress/code-coverage/task')(on, config);
      // // include any other plugin code...

      // // It's IMPORTANT to return the config object
      // // with any changed environment variables
      // return config;
    },
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}', // Specify the path to your component tests
    numTestsKeptInMemory: 1,
    experimentalMemoryManagement: true,
  },

  env: {
    // Auth0
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.REACT_APP_AUTH0_DOMAIN,
    auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    auth0_client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  },
});
