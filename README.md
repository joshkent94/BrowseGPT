<p align="center">
    <img alt="Open source license" src="https://img.shields.io/github/license/joshkent94/browsegpt?label=Open+Source+License" align="center">
    <img alt="Number of commits" src="https://img.shields.io/github/commit-activity/t/joshkent94/browsegpt/main?label=Commits" align="center">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/joshkent94/browsegpt/main?label=Last Commit" align="center">
</p>

<br>

<img alt="Logo" src="./public/logo.png" align="center">

<br>

> An AI assistant for your browser. Now available to download from the [Chrome Store](https://chrome.google.com/webstore/detail/browsegpt/ijdehllahgkhhcoffcohgmbebcchdknb)!

## Table of contents

-   [General info](#general-info)
-   [Technologies](#technologies)
-   [Development](#development)
-   [Contact](#contact)

## General info

A browser extension using the sidepanel API that allows users to persistently interact with an AI assistant whilst browsing the web. Under the hood the extension is integrated to OpenAI's GPT3.5.

## Technologies

-   Express
-   Postgresql
-   Prisma
-   React
-   tRPC
-   Tailwind
-   Typescript
-   Turborepo

## Development

You need to be running Node v18 for this project (as specified in the .nvmrc file). We suggest using [NVM](https://github.com/nvm-sh/nvm) to manage your Node versions.

The project also uses Turborepo to manage all workspaces simultaneously. Run the below to install Turborepo globally (substitute in yarn if necessary).

```
npm install turbo@latest --global
```

From the project root, run the below to install dependencies.

```
npm install
```

The project uses Postgres and Prisma for database management. Download [Postgres](https://www.postgresql.org/download/), create a database and add your database connection URL to the appropriate .env file (your .env files should match the format and location of the .env.example files).

Every time you change the database schema in schema.prisma, you should run the below command to generate a new migration script for your schema changes and apply the changes to your database.

```
turbo prisma:migrate:dev -- --name={name-for-your-migration}
```

To lint the project, run the below command from the project root.

```
turbo correct
```

For instructions on developing a particular extension, see the README in the corresponding extension's directory.

## Contact

Created by [@joshuakent](mailto:josh.kent94@yahoo.co.uk) - if you'd like to chat about feature requests, contributing or anything else please get in touch!