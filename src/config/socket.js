import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("a user connected: ", socket.id);

  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
    // console.log(`Socket ${socket.id} joined auction room ${auctionId}`);
  });
//   socket.on("leaveAuction", (auctionId) => {
//     socket.leave(auctionId);
//     console.log(`Socket ${socket.id} left auction room ${auctionId}`);
//   });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export { app, server, io };
