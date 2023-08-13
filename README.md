<p align="center">
    <img alt="GitHub" src="https://img.shields.io/github/license/joshkent94/browsegpt" align="center">
    <img alt="GitHub manifest version (path)" src="https://img.shields.io/github/manifest-json/v/joshkent94/browsegpt?filename=extension/public/manifest.json" align="center">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/joshkent94/browsegpt" align="center">
</p>
<h1 align="center">
    BrowseGPT
</h1>

> An AI assistant for your browser. Now available to [download](https://chrome.google.com/webstore/detail/browsegpt/ijdehllahgkhhcoffcohgmbebcchdknb) from the Chrome Store!

## Table of contents

-   [General info](#general-info)
-   [Usage](#usage)
-   [Technologies](#technologies)
-   [Development](#development)
-   [Contact](#contact)

## General info

A Chrome extension using the sidepanel API that allows users to persistently interact with an AI assistant whilst browsing the web. Under the hood the extension is integrated to OpenAI's GPT3.5.

## Usage

Sign up/log in securely using OAuth.

![Screenshot of log in page](./public/login.png)

Chat with an AI assistant across your whole browser experience. The AI knows your name and location (if available via your browser).

![Screenshot of app in action](./public/using-location.png)

It also knows the site you're currently on.

![Screenshot of app in action](./public/current-site.png)

Type '/' to see a list of quick search prompts.

![Screenshot of app in action](./public/command-ui.png)

And instantly see the result in a new tab.

![Screenshot of app in action](./public/command-result.png)

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

***

### Chrome

To develop the Chrome extension, run the below. This will compile the back end code and Chrome extension, start a server at port 3000, and watch for changes across the two workspaces.

```
turbo dev:chrome
```

You may get an error saying you need to use an interactive command line for this, if so, run the below instead.

```
cd server && npm run prisma:migrate:dev
```

To create a production build of the extension, run the below.

```
turbo build:chrome
```

***

### Edge

To develop the Edge extension, run the below. This will compile the back end code and Edge extension, start a server at port 3000, and watch for changes across the two workspaces.

```
turbo dev:edge
```

You may get an error saying you need to use an interactive command line for this, if so, run the below instead.

```
cd server && npm run prisma:migrate:dev
```

To create a production build of the extension, run the below.

```
turbo build:edge
```

***

Every time you change the database schema in schema.prisma, you should run the below command to generate a new migration script for your schema changes and apply the changes to your database.

```
turbo prisma:migrate:dev -- --name={name-for-your-migration}
```

To lint the project, run the below command from the project root.

```
turbo correct
```

To use the extension in the browser, download and open the latest version of [Google Chrome](https://www.google.com/intl/en_uk/chrome/dr/download/) or [Microsoft Edge](https://www.microsoft.com/en-us/edge/download?form=MA13FJ), then go to the extensions page, turn on development mode, click 'Load unpacked' and select the dist folder within the appropriate extension's directory. Click on the extension's icon to open the sidepanel, or use the shortcut CMD + SHIFT + SPACE.

To see any front end changes in the browser, you'll need to manually reload the extension by clicking the refresh button from the extensions page. Alternatively, download the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) to make this easier.

## Contact

Created by [@joshuakent](mailto:josh.kent94@yahoo.co.uk) - if you'd like to chat about feature requests, contributing or anything else please get in touch!