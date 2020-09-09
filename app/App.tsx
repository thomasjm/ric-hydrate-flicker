
import * as React from "react";
import {Switch, Route, useLocation} from "react-router-dom";
import {lazy, LazyBoundary} from "react-imported-component";

import "regenerator-runtime/runtime";

// TODO: can't seem to import CSS from node_modules because prod build gets
// "SyntaxError: Unexpected token {" when loading it
// import "tachyons/css/tachyons.min.css";
import "./css/tachyons.min.css";
import "./css/main.css";

export function renderPage<P>(Component: React.FunctionComponent<P>, props?: P) {
  return () => (
    <LazyBoundary fallback={<div />}>
        <Component {...(props ? props : ({} as any))} />
    </LazyBoundary>
  );
}

export default function App() {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
        {renderPage(lazy(() => import("./pages/simple")))()}
    </>
  );
}
