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
import {getHTMLFragments} from "./client";

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

const stream = false;

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

    if (stream) {
      // TODO: go back to streaming once we figure out how to set status
      const [startingHTMLFragment, endingHTMLFragment] = getHTMLFragments({
        drainHydrateMarks: printDrainHydrateMarks()
      });

      res.status(200);
      res.write(startingHTMLFragment);
      const sheet = new ServerStyleSheet();
      const stream =  sheet.interleaveWithNodeStream(
        renderToNodeStream(sheet.collectStyles(app))
      );
      stream.pipe(through(write, end(endingHTMLFragment))).pipe(res);
    } else {
      await whenComponentsReady();

      const html = renderToString(sheets.collect(app));

      if (context.url) {
        // Note: use 302 here, because browsers often cache 301s. This causes problems where
        // logging out and back in as another user and then visiting /profile for a redirect
        // can cause you to get the original user's page due to the browser caching the redirect.
        res.redirect(context.status || 302, context.url);
      } else {
        if (context.status) {
          res.status(context.status);
        } else {
          res.status(200);
        }

        // Grab the CSS from the sheets.
        const css = sheets.toString();

        // Get the initial GraphQL state
        const initialState = client.extract();

        const htmlPath = path.join(process.cwd(), "dist", "client", "index.html");
        let fullHtml = fs.readFileSync(htmlPath).toString();
        fullHtml = fullHtml.replace("<!--META-->", `<script>window.__APOLLO_STATE__ = ${JSON.stringify(initialState)};</script>\n<style id="jss-server-side">${css}</style>\n`)
        fullHtml = fullHtml.replace("<!--MARKS-->", printDrainHydrateMarks() + "\n");
        fullHtml = fullHtml.replace(`<div id="app">`, `\n<div id="app">${html}</div>\n`)

        res.write(fullHtml);
        res.end();
      }
    }


  } catch (e) {
    log.error(e);
    res.status(500);
    res.end();
  }
}
