const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const connection = require("./db");
const { User } = require("./modals/Logins/UserLogin")
const userRoutes = require('./Routes/RouteLogins/User')

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);

 // Attach Socket.IO to the HTTP server
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Connect to MongoDB
connection();
app.get('/', function(req, res) {
  res.sendfile('index.html');
});
// Socket.IO event listeners
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });

//   // Handle doctor joining room
//   socket.on("doctorJoinRoom", (doctorId, userId) => {
//     console.log(`Doctor ${doctorId} joined room for user ${userId}`);
//     // Notify patient that the doctor is online
//     io.to(userId).emit("doctorOnlineNotification", "Your doctor is online. Join the room.");
//   });
// });
io.on('connection', function (socket) {
  console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  
    // Handle doctor joining room
    socket.on("doctorJoinRoom", (doctorId, userId) => {
      console.log(`Doctor ${doctorId} joined room for user ${userId}`);
      // Notify patient that the doctor is online
      io.emit("doctorOnlineNotification", `Your doctor ${doctorId}`);
    });
    socket.on("patientrejectcall", (roomId, userId) => {
      console.log(`Doctor ${roomId} joined room for user ${userId}`);
      // Notify patient that the doctor is online
      io.emit("patientnotAvaible", `Your Patient Reject the call`);
    });
});

const PORT = process.env.PORT || 3006;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
