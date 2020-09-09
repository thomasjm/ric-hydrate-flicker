import express from "express";
import path from "path";
import log from "llog";
import {whenComponentsReady} from "react-imported-component/boot";

import ssr, {serverPort} from "./ssr";

export const server = express();
export const serveStatic = express.static;

// Expose the public directory as /dist and point to the browser version
server.use("/dist/client", serveStatic(path.resolve(process.cwd(), "dist", "client")));
server.use("/static", serveStatic(path.resolve(process.cwd(), "dist", "static")));
server.get("/*", ssr)

// Check for PORT environment variable, otherwise fallback on Parcel default port
const port = process.env.PORT || 1234;
export const onListen = () => log.info(`Listening on port ${port}...`);

async function begin() {
  log.info(`Running against server port ${serverPort}...`)

  const imported = await import("../app/imported");
  await whenComponentsReady();
  server.listen(port, onListen(port));
}

begin();
