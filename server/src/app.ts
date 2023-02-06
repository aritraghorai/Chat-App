import config from "config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";
import log from "./utils/logger";

const port = config.get<number>("PORT");
const host = config.get<string>("HOST");
const crossOrigin = config.get<string>("CROSS_ORIGIN");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: crossOrigin,
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Server is runing");
});

httpServer.listen(port, host, () => {
  log.info("Server is listing");

  socket({ io });
});
