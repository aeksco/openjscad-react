<h1 align="center">openjscad-react</h1>

<div align="center">
  <strong>React.js component for rendering &amp; exporting OpenJSCAD scripts</strong>
</div>

<br />

<div align="center">
  Write an <code>OpenJSCAD</code> script and wire it up to some inputs to start exporting user-customizable designs
</div>

<br />

<div align="center">
  <!-- GitHub Stars -->
  <img src="https://img.shields.io/github/stars/aeksco/openjscad-react.svg?style=social&label=Star" alt="GitHub Stars" />

  <!-- MIT License -->
  <img src="https://img.shields.io/apm/l/atomic-design-ui.svg" alt="MIT License" />

  <!-- Hit Count -->
  <img src="http://hits.dwyl.com/aeksco/openjscad-react.svg" alt="Hit Count" />

  <!-- PRs Welcome -->
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="Hit Count" />
</div>

<div align="center">
  <h3>
    <a href="https://aeksco.github.io/openjscad-react">
      Website
    </a>
    <span> | </span>
    <a href="https://aeksco.github.io/openjscad-react">
      Examples
    </a>
    <span> | </span>
    <a href="https://github.com/aeksco/openjscad-react-next-starter">
      Next.js Starter Kit
    </a>
  </h3>
</div>

![Demo Example](https://i.imgur.com/9NijaGj.png "Demo Example")

## Table of Contents

-   [Quick Start](#quick-start)
-   [Install](#install)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Developing](#developing)
-   [Compatibility](#compatibility)
-   [License](#license)

<hr/>

## Quick Start

If you want to jump right in with a working React app with `openjscad-react` installed, check out the [openjscad-react-nextjs-starter](https://github.com/aeksco/openjscad-react-next-starter).

## Install

Install `openjscad-react` with [Yarn](https://classic.yarnpkg.com/en/) or [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm):

```
yarn add openjscad-react
```

```
npm install --save openjscad-react
```

## Usage

Import the `OpenJSCAD` component in your React component and pass in a valid OpenJSCAD script:

```tsx
import * as React from "react";
import { OpenJSCAD } from "openjscad-react";

export function MyComponent(props: { script: string }) {
    return (
        <OpenJSCAD
            className="grid grid-cols-1 w-full"
            jscadScript={props.script}
        />
    );
}
```

If you're using a server-side rendered framework like Vercel's [Next.js](https://nextjs.org/), you will need to import the `OpenJSCAD` component using a [dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import):

```tsx
import * as React from "react";
import dynamic from "next/dynamic";
import { ViewerProps } from "openjscad-react";

const OpenJSCAD: React.ComponentType<ViewerProps> = dynamic(
    () =>
        import("openjscad-react/dist/src/OpenJSCAD").then(
            (mod) => mod.OpenJSCAD,
        ),
    { ssr: false },
);

export function MyComponent(props: { script: string }) {
    return (
        <OpenJSCAD
            className="grid grid-cols-1 w-full"
            jscadScript={props.script}
        />
    );
}
```

## Configuration

See the [Props Reference](/?path=/story/docs-getting-started-props-reference--page) for more details about Configuration

## Developing

Consult the [Contribution Guide](https://github.com/aeksco/openjscad-react/blob/main/CONTRIBUTING.md) to get started :rocket:

## Compatibility

The `openjscad-react` module is compatible with React v16.8+ and works with ReactDOM. Next.js is supported. React Native is not supported at this time.

## Built with

-   [React](https://reactjs.org)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Storybook](https://storybook.js.org/)
-   [Jest](https://jestjs.io)
-   [Eslint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [lodash.debounce](https://www.npmjs.com/package/lodash.debounce)
-   [Tailwind CSS](https://tailwindcss.com)

## Misc. References

-   [OpenJSCAD Homepage](https://openjscad.org)
-   [OpenJSCAD API Reference](https://openjscad.org/dokuwiki/doku.php)
-   [JSCAD User Group](https://openjscad.nodebb.com/)

### TODOs + Known Issues

-   Publish 0.1.0 package
-   Update `https://github.com/aeksco/openjscad-react-next-starter`

### GitHub Issues to add

-   Improve documentation with better examples
-   Cannot instantiate multiple `OpenJSCAD` components on the page simultaneiously (this may be due to limitations in the `@jscad/web` package, but I'm positive)
-   The `ResizeObserver` component ideally shouldn't exist, but the `OpenJSCAD` component blows up without the extra layer in place

### License

Open source under the [MIT License](https://github.com/aeksco/openjscad-react/blob/main/LICENSE). Built with&nbsp;:heart:&nbsp; by [@aeksco](https://github.com/aeksco)

[![Tweet](https://img.shields.io/twitter/url/https/github.com/aeksco/openjscad-react.svg?style=social)](https://twitter.com/intent/tweet?text=https://github.com/aeksco/openjscad-react)
