<p align="center">
    <img alt="GitHub" src="https://img.shields.io/github/license/joshkent94/browsegpt">
</p>

# BrowseGPT

> An AI assistant for your browser

## Table of contents

-   [General info](#general-info)
-   [Screenshot](#screenshot)
-   [Technologies](#technologies)
-   [Development](#development)
-   [Contact](#contact)

## General info

A Chrome extension using the sidepanel API that allows users to persistently interact with an AI assistant whilst browsing the web. Under the hood the extension is integrated to OpenAI's GPT3.5.

## Screenshot

![Screenshot of extension working](./public/app-in-action.png)

## Technologies

-   Express
-   React
-   tRPC
-   Tailwind
-   Typescript
-   Turborepo

## Development

You need to be running Node v18 for this project (as specified in the .nvmrc file). We suggest using [NVM](https://github.com/nvm-sh/nvm) to manage your Node versions.

The project also uses Turborepo to manage the front and back end workspaces simultaneously. Run the below to install Turborepo globally (substitute in yarn if necessary).

```
npm install turbo@latest --global
```

From the project root, run the below to install dependencies.

```
npm install
```

Then create initial development builds for both front and back end.

```
turbo run build
```

To perform development, run the below. This will compile both front and back end, start a server at port 3000, and watch for changes across the entire codebase.

```
turbo run dev
```

To lint the project, run the below command from the project root.

```
turbo run correct
```

Download the beta version of [Google Chrome](https://www.google.com/intl/en_uk/chrome/beta/), then go to Chrome extensions, turn on development mode, click 'Load unpacked' and select the dist folder within the extension directory. Click on the extension icon to open the sidepanel, or use the shortcut CMD + SHIFT + SPACE. Follow the instructions in the extension to get your API key from OpenAI (this is needed for development but is not actually used by default, see [./server/routes/conversation.ts](https://github.com/joshkent94/BrowseGPT/blob/19aa2977499b37f800b0308fb44edcb8621973fa/server/routes/conversation.ts)).

To see any front end changes in the browser, you'll need to manually reload the extension by clicking the refresh button from the extensions page. Alternatively, download the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) to make this easier.

## Contact

Created by [@joshuakent](mailto:josh.kent94@yahoo.co.uk) - if you'd like to chat about feature requests, contributing or anything else please get in touch!