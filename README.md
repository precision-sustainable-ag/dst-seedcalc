<div align="center">

[![PSA](./public/PSALogo.png)](https://www.precisionsustainableag.org/)

# DST Seeding Rate Calculator

</div>

## About

The DST Seeding Rate Calculator is a web-based tool developed for [Precision Sustainable Agriculture (PSA)](https://www.precisionsustainableag.org/). This application helps farmers in the MCCC/NECCC/SCCC regions calculate optimal seeding rates for their crops, supporting sustainable agricultural practices.

**Live Application:** [https://covercrop-seedcalc.org/](https://covercrop-seedcalc.org/)

**Documentation:** [PSA Wiki - Seeding Rate Calculator](https://precision-sustainable-ag.atlassian.net/wiki/spaces/DST/pages/162037825/Seeding+Rate+Calculator)

**Date Created**:          02/16/22  
**Date Last Modified:**    05/30/25

## Quick Links

- [DST Seeding Rate Calculator](#dst-seeding-rate-calculator)
  - [About](#about)
  - [Quick Links](#quick-links)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Development Guide](#development-guide)
    - [Tech Stack](#tech-stack)
    - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js and npm
- Git

### Installation Steps

1. The first step is downloading the code by cloning the repository:

    ```sh
    git clone https://github.com/precision-sustainable-ag/dst-seedcalc.git
    ```

2. Run `npm install` to install project dependencies. A full list of the dependencies can be found in package.json. If you are running on a windows machine delete `package-lock.json` prior to running the below command.

3. Create a `.env` file in the root directory. The file will contain following keys, ask @mikahpinegar for the values of the keys.
   ```
   VITE_API_AUTH0_DOMAIN=<auth0 domain>
   VITE_API_AUTH0_CLIENT_ID=<auth0 client id>
   VITE_API_AUTH0_AUDIENCE=<auth0 audience>
   VITE_API_USER_HISTORY_API_URL=<user history url>
   VITE_API_USER_HISTORY_SCHEMA=<schema>
   VITE_API_RELEASE_NOTES_URL=<release notes url>
   VITE_API_MAPBOX_TOKEN=<mapbox token>
   VITE_AUTH0_USERNAME=<auth0 username>
   VITE_AUTH0_PASSWORD=<auth0 password>
   ```

4. After the dependencies have been installed and the .env file has been created, run `npm start` to run the code locally.

## Development Guide

### Tech Stack

The technologies we are currently using in this repo:

- **React**: Front-end React app
- **Redux**: State management
- **Material UI**: UI Library

### Project Structure

```sh
src/
├── components        # Re-usable components
├── features          # Redux slice logic
├── pages             # Core pages
├── shared            # Constant data, theme and utility functions
```

## Troubleshooting

**Line Ending Issues**  
To fix CRLF/LF line ending problems (CRLF -> LF): 
```
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```
