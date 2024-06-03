<div align="center">

[![PSA](./public/PSALogo.png)](https://www.precisionsustainableag.org/)

### DST Seeding Rate Calculator

</div>

This is the Seeding Rate Calculator codebase for [PSA](https://www.precisionsustainableag.org/). Helping MCCC/NECCC farmers calculate their seeding rate.

To access the live tool, visit [here](https://covercrop-seedcalc.org/).

To see the documents for this tool, visit [the wiki pages](https://precision-sustainable-ag.atlassian.net/wiki/spaces/DST/pages/162037825/Seeding+Rate+Calculator).

**Date Created:** 02/16/22
**Date Last Modified:** 06/03/24

### Table of Contents

- [Contributing](#contributing)
  - [Technologies](#technologies)
  - [First time setup](#first-time-setup)
  - [Folder structure](#folder-structure)
  - [File structure](#file-structure)
- [Runbook](#runbook)

## Contributing

### Technologies

The technologies we are currently using in this repo:

- **React**: Front-end Reat app
- **Redux**: State management
- **Material UI**: UI Library


### First time setup

1. The first step is downloading the code by cloning the repository:

    ```sh
    git clone https://github.com/precision-sustainable-ag/dst-seedcalc.git
    ```

2. Then run `npm config set @psa:registry https://node.bit.cloud`

3. Run `npm install` to install project dependencies. A full list of the dependencies can be found in package.json. If you are running on a windows machine delete `package-lock.json` prior to running the below command.

4. Create a `.env` file in the root directory. The file will contain following keys, ask @mikahpinegar for the values of the keys.

    ```
    REACT_APP_AUTH0_DOMAIN = "<auth0 domain>"
    REACT_APP_AUTH0_CLIENT_ID = "<auth0 client id>"
    REACT_APP_AUTH0_AUDIENCE="<auth0 audience>"
    REACT_APP_USER_HISTORY_API_URL="<user history url>"
    REACT_APP_USER_HISTORY_SCHEMA="<schema>"
    ```

5. After the dependencies have been installed and the .env file has been created, run `npm start` to run the code locally. 


### Folder structure

```sh
src/
├── components        # Re-usable components
├── features          # Redux slice logic
├── pages             # Core pages
├── shared            # Constant data, theme and utility functions
```

### File structure

Generally for the core pages, we have comments that specify the section of the page as such:

```sh
//////////////////////////////////////////////////////////
//                      Imports                         //      # Imports
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                      Redux                           //      # Redux logic
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                   State Logic                        //      # Core logic
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                     useEffect                        //      # useEffect
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                      Render                          //      # Render
//////////////////////////////////////////////////////////
```


## Runbook

**Symptom:**
Node sass not supported on Mac OS `Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime (88)`

**Solution:**
`npm rebuild node-sass`

**Symptom:**
After running `npm install` you might run into an `Error E404 - Not Found - GET https://registry.npmjs.org/@psa%2fdst.ui.map - Not found`

**Solution:**
Follow these steps:
1. Install the `react-scripts` package using `npm install react-scripts --save`
2. Run  `npm start`

**Line Spacing**
Set Line spacing (CRLF -> LF)
`git config core.autocrlf false`
`git rm --cached -r .`
`git reset --hard`