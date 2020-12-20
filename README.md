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

-   Add Jest tests w/ JSDom
-   Add Eslint
-   Clean up Examples.stories.tsx
-   Cannot instantiate multiple `OpenJSCAD` components on the page simultaneiously (this may be due to limitations in the `@jscad/web` package, but I'm positive)
-   The `ResizeObserver` component ideally shouldn't exist, but the `OpenJSCAD` component blows up without the extra layer in place
-   Add link to `https://github.com/aeksco/openjscad-react-next-starter` in `README.md`
-   Update Storybook to 6.1.11
