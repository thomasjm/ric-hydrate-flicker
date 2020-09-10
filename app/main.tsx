// Entry point for the browser
// Start your React application and add the required containers
// Here we have <BrowserRouter /> for react-router

import React from "react";
import ReactDOM from "react-dom";
import {HelmetProvider} from "react-helmet-async";
import "react-hot-loader";
import {rehydrateMarks} from "react-imported-component";
import {BrowserRouter} from "react-router-dom";
import {moveStyles} from "used-styles/moveStyles";

import "./imported";

import {inMemoryCacheArgs} from "./cacheTypePolicies";

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

import App from "./App";

// Monkey-patch React as instructed by react-imported-component
import { lazy, LazyBoundary } from "react-imported-component";
React.lazy = lazy;
React.Suspense = LazyBoundary;

// move SSR-ed styles to the head
moveStyles();

// Browser side client
export const client = new ApolloClient({
  uri: window.location.origin + "/api/public/graphql",
  cache: (new InMemoryCache(inMemoryCacheArgs)).restore(window["__APOLLO_STATE__"])
});

const helmetContext = {};
const app = (
  <App />
);

// TODO: why does the example ship with this timeout value set to 1000?
const TM = 5000;
// const TM = 0;

const element = document.getElementById("app");

console.log("waiting");
setTimeout(function () {
  // rehydrate the bundle marks
  console.log("loading");
  rehydrateMarks().then(() => {
    console.log("loaded...");
    setTimeout(function () {
      console.log("hydrating");

      console.log('before', element.innerHTML);
      ReactDOM.hydrate(app, element);
      console.log('after', element.innerHTML);
    }, TM);
  });
}, TM);

// Hot reload is that easy with Parcel
if (module["hot"]) {
  module["hot"].accept();
}
