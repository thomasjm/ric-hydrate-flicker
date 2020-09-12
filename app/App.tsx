
import * as React from "react";
import {Switch, Route, useLocation} from "react-router-dom";
import {lazy, LazyBoundary, useImported} from "react-imported-component";

import "regenerator-runtime/runtime";

function importPage<P>(importFn: () => React.FunctionComponent<P>, props?: P) {
  const { imported, loading } = useImported(importFn);

  return loading ? <div /> : <imported {...props} />;
}

const Simple = importPage(() => import("./pages/simple"));

export default function App() {
  return (
    <>
        <Simple />
    </>
  );
}
