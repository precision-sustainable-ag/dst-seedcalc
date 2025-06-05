import { testAuth0Env } from '../data/keys';

const apiBaseURL = `https://${testAuth0Env || /(localhost|dev)/i.test(window.location) ? 'developapi' : 'api'}.covercrop-selector.org`;

export default apiBaseURL;
