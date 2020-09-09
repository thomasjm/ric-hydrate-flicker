
const {createProxyMiddleware} = require("http-proxy-middleware");
const Bundler = require("parcel-bundler");
const express = require("express");

const bundler = new Bundler("app/index.html", {
  cache: false,
  hmrPort: 1235
});

const app = express();
const PORT = process.env.PORT || 1234;

app.use(bundler.middleware());

app.listen(PORT);
