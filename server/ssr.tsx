import fs from "fs";
import path from "path";
import React from "react";
import {renderToNodeStream, renderToString} from "react-dom/server";
import {HelmetProvider} from "react-helmet-async";
import {StaticRouter} from "react-router-dom";
import {ServerStyleSheet} from "styled-components";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/core/styles";
import {printDrainHydrateMarks} from "react-imported-component";
import {whenComponentsReady} from "react-imported-component/boot";
import log from "llog";
import through from "through";
import {getDataFromTree} from "@apollo/client/react/ssr";
import {ApolloClient, ApolloProvider, InMemoryCache, createHttpLink} from "@apollo/client";
import {fetch} from "cross-fetch";

import App from "../app/App";
import {inMemoryCacheArgs} from "../app/cacheTypePolicies";

const isomorphicCookie = require("isomorphic-cookie");

function customFetch(cookie) {
  return (uri, options) => {
    return fetch(uri, {
      ...options,
      credentials: "include",
      headers: {...(options.headers || {}), cookie }
    });
  }
}

export const serverPort = process.env.CODEDOWN_SERVER_PORT;

function getClient(req) {
  // Server side client
  return new ApolloClient({
    ssrMode: true,
    credentials: "same-origin",
    link: createHttpLink({
      uri: `http://localhost:${serverPort}/api/public/graphql`,
      fetch: customFetch(req.get("Cookie"))
    }),
    cache: new InMemoryCache(inMemoryCacheArgs)
  });
}

export function write(data) {
  this.queue(data);
}

export function end(endingHTMLFragment) {
  function end() {
    this.queue(endingHTMLFragment);
    this.queue(null);
  }

  return end;
}

export default async function ssr(req, res) {
  try {
    console.log("Handling request", req.originalUrl);

    // GraphQL client
    const client = getClient(req);

    // Material-UI styles
    const sheets = new ServerStyleSheets();

    const context = {};
    const helmetContext = {}
    const app = (
      <App />
    );

    await getDataFromTree(app);

    await whenComponentsReady();

    const html = renderToString(sheets.collect(app));

    res.status(200);

    // Grab the CSS from the sheets.
    const css = sheets.toString();

    // Get the initial GraphQL state
    const initialState = client.extract();

    const htmlPath = path.join(process.cwd(), "dist", "client", "index.html");
    let fullHtml = fs.readFileSync(htmlPath).toString();
    fullHtml = fullHtml.replace("<!--META-->", `<script>window.__APOLLO_STATE__ = ${JSON.stringify(initialState)};</script>\n<style id="jss-server-side">${css}</style>\n`)
    fullHtml = fullHtml.replace("<!--MARKS-->", printDrainHydrateMarks() + "\n");
    fullHtml = fullHtml.replace(`<div id="app">`, `\n<div id="app">${html}`)

    res.write(fullHtml);
    res.end();
  } catch (e) {
    log.error(e);
    res.status(500);
    res.end();
  }
}
