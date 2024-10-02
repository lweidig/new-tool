# new-tool

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have installed [Node.js](https://nodejs.org/) (version 20.x or later).
-   You have installed [npm](https://github.com/npm/cli) (version 10.x or later).

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/lweidig/new-tool.git
    ```

2. Navigate to the project directory:

    ```sh
    cd new-tool
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

## Linting

This Project uses [ESLint](https://eslint.org) for linting.

To see the config used for this project have a look at [eslint.config.mjs](./eslint.config.mjs)

```sh
npm run lint
```

## Formatting

This Project adheres to a standardized Coding Style that is implemented
via [Prettier](https://prettier.io).

To see the config used for this project have a look at [.prettierrc.yaml](.prettierrc.yaml)

```sh
npm run format
```

## Building the Project

To build the project, run exactly in this order:

```sh
npm run build:erm-moddle
npm run build:erm-js
npm run build:build-check
```

## Running Tests

For now tests are only implemented in the two Libraries erm-moddle and erm-js.

```sh
npm run test:erm-moddle
npm run test:erm-js
```

## Starting the Build Check App as a DEV Server

Given you completed all build steps successfully you can finally start the build-check app and see
"erm-moddle" and "erm-js" in action.

```sh
npm run start:build-check
```

After running this command you can open the build-check via [localhost:8080](http://localhost:8080)
in any modern webbrowser of your choosing.

With Ctrl+C the dev server can be gracefully shut down.
