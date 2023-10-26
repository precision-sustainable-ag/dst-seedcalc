<div align="center">

[![PSA](./public/PSALogo.png)](https://www.precisionsustainableag.org/)

### DST Seeding Rate Calculator

</div>

This is the Seeding Rate Calculator codebase for [PSA](https://www.precisionsustainableag.org/). Helping MCCC/NECCC farmers calculate their seeding rate.

## Docs

- [Contributing](#contributing)
  - [Codebase](#codebase)
    - [Technologies](#technologies)
    - [Folder Structure](#folder-structure)
    - [Code Style](#code-style)
  - [First time setup](#first-time-setup)
  - [covercrop-seeding-rate-calculator](#covercrop-seeding-rate-calculator)
  - [Issues](#issues)
  - [Development Cycles](#development-cycles)

## Contributing

### Codebase

#### Technologies

The technologies we are currently using in this repo:

- **React**: Front-end Reat app
- **Redux**: State management
- **Material UI**: UI Library

#### Folder structure

```sh
src/
├── components        # Re-usable components
├── features    # Redux slice logic
├── pages   # Core pages
├── shared     # Shared javascript code
```

#### File structure

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

#### Code Style

### First time setup

The first step to running the Seeding rate repo locally is downloading the code by cloning the repository:

```sh
git clone https://github.com/precision-sustainable-ag/dst-seedcalc.git
```

Then install & run:

```sh
npm install && npm run start
```

# covercrop-seeding-rate-calculator

topic-tool-organization

# Issues

We will organize issues in Projects to follow a Kanban style of project management.

# Development Cycles

We will begin by developing the core functionalties that both the NECCC and MCCC share.
From there we will fork the repository for the MCCC and again for the NECCC to support their specific process logic and the ui requirements those dictate.
