
import * as React from "react";
import {Switch, Route, useLocation} from "react-router-dom";
import importedComponent from "react-imported-component";

import "regenerator-runtime/runtime";

const Simple = importedComponent(() => import("./pages/simple"));

export default function App() {
  return (
    <>
        <Simple />
    </>
  );
}
