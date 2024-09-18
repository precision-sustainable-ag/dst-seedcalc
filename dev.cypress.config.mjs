import { defineConfig } from 'cypress';
import coverageTask from '@cypress/code-coverage/task.js';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    experimentalRunAllSpecs: true,
    trashAssetsBeforeRuns: true,
    setupNodeEvents(on, config) {
      coverageTask(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}', // Specify the path to your component tests
    numTestsKeptInMemory: 1,
    experimentalMemoryManagement: true,
    setupNodeEvents(on, config) {
      coverageTask(on, config);
      return config;
    },
  },

  env: {
    auth0_username: process.env.VITE_AUTH0_USERNAME,
    auth0_password: process.env.VITE_AUTH0_PASSWORD,
    auth0_domain: process.env.VITE_API_AUTH0_DOMAIN,
    auth0_audience: process.env.VITE_API_AUTH0_AUDIENCE,
    auth0_client_id: process.env.VITE_API_AUTH0_CLIENT_ID,
  },
});