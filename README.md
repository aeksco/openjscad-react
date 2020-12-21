[![GitHub stars](https://img.shields.io/github/stars/aeksco/openjscad-react.svg?style=social&label=Stars&style=plastic)]()
[![GitHub watchers](https://img.shields.io/github/watchers/aeksco/openjscad-react.svg?style=social&label=Watch&style=plastic)]()
[![GitHub forks](https://img.shields.io/github/forks/aeksco/openjscad-react.svg?style=social&label=Fork&style=plastic)]()
[![GitHub contributors](https://img.shields.io/github/contributors/aeksco/openjscad-react.svg)](https://github.com/aeksco/openjscad-react/graphs/contributors)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![GitHub issues](https://img.shields.io/github/issues/aeksco/openjscad-react.svg)](https://github.com/aeksco/openjscad-react/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/aeksco/openjscad-react.svg)](https://github.com/aeksco/openjscad-react/commits/master)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/aeksco/openjscad-react.svg?style=flat)]()
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

[![HitCount](http://hits.dwyl.com/aeksco/openjscad-react.svg)](http://hits.dwyl.com/aeksco/openjscad-react)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/aeksco/openjscad-react.svg?style=social)](https://twitter.com/intent/tweet?text=https://github.com/aeksco/openjscad-react)
[![Twitter Follow](https://img.shields.io/twitter/follow/aeksco.svg?style=social)](https://twitter.com/aeksco)

![Demo Example](https://i.imgur.com/9NijaGj.png "Demo Example")

# openjscad-react

React.js bindings for the OpenJSCAD.org project

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

Run the [Storybook](https://storybook.js.org/) server by running the following commands:

```
yarn install
yarn start
```

Run [Jest](https://jestjs.io) tests wi the following command:

```
yarn test
```

## Compatibility

The `openjscad-react` module is compatible with React v16.8+ and works with ReactDOM. React Native is not supported at this time.

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

-   Clean up Examples.stories.tsx
-   Add GitHub community wellness check
-   TODO - add image to `README.md`
-   TODO - add "Built with <3 by aeksco" to README
-   Publish 0.1.0 package
-   Update `https://github.com/aeksco/openjscad-react-next-starter` + add to `README.md`

### GitHub Issues to add

-   Improve documentation with better examples
-   Cannot instantiate multiple `OpenJSCAD` components on the page simultaneiously (this may be due to limitations in the `@jscad/web` package, but I'm positive)
-   The `ResizeObserver` component ideally shouldn't exist, but the `OpenJSCAD` component blows up without the extra layer in place

### License

Open source under the [MIT License](https://github.com/aeksco/openjscad-react/blob/main/LICENSE). Built with&nbsp;:heart:&nbsp;by [@aeksco](https://github.com/aeksco)
