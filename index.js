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
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

// io.on('connection', function (socket) {
//   console.log("New client connected");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });

//   // Handle doctor joining room
//   socket.on("doctorJoinRoom", (doctorId, userId) => {
//     console.log(`Doctor ${doctorId} joined room for user ${userId}`);
//     // Notify patient that the doctor is online
//     io.emit("doctorOnlineNotification", `Your doctor ${doctorId}`);
//   });
//   socket.on("patientrejectcall", (roomId, userId) => {
//     console.log(`Doctor ${roomId} joined room for user ${userId}`);
//     // Notify patient that the doctor is online
//     io.emit("patientnotAvaible", `Your Patient Reject the call`);
//   });
// });

// Store user ID along with socket ID
const userIdToSocketId = {};

// Define socket event handlers
io.on('connection', (socket) => {
  console.log('A user connected');
  // Store user ID along with socket ID
  socket.on('storeSocketId', ({ docId }) => {
    userIdToSocketId[docId] = socket.id;
    console.log(`User ${docId} connected with socket ID ${socket.id}`);
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

  // Handle call request from buyer to seller
  socket.on('callRequestFromBuyer', ({ buyerId, sellerId }) => {
    // Find the socket ID of the seller using their user ID
    const sellerSocketId = userIdToSocketId[sellerId];
    if (sellerSocketId) {
      // Emit call request to seller
      console.log("callRequestFromBuyer");
      console.log("buyerId", buyerId);
      console.log("sellerId", sellerId);
      io.to(sellerSocketId).emit('incomingCallFromBuyer', { callerId: buyerId });
    } else {
      console.log(`Seller with ID ${sellerId} is not connected.`);
    }
  });
  // Handle call request from seller to buyer
  socket.on('callRequestFromSeller', ({ buyerId, sellerId }) => {
    // Find the socket ID of the seller using their user ID
    const sellerSocketId = userIdToSocketId[buyerId];
    if (sellerSocketId) {
      // Emit call request to buyer
      console.log("callRequestFromSeller");
      console.log("buyerId", buyerId);
      console.log("sellerId", sellerId);
      io.to(sellerSocketId).emit('incomingCallFromSeller', { callerId: sellerId });
    } else {
      console.log(`Buyer with ID ${buyerId} is not connected.`);
    }
  });

  // Handle call acceptance
  socket.on('acceptCall', ({ callerId }) => {
    // Emit call acceptance to buyer
    const callerSocketId = userIdToSocketId[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit('callAccepted');
    } else {
      console.log(`Caller with ID ${callerId} is not connected.`);
    }
  });

  // Handle reject call
  socket.on('rejectCall', ({ callerId }) => {
    // Emit call rejection to the caller
    const callerSocketId = userIdToSocketId[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit('callRejected');
    } else {
      console.log(`Caller with ID ${callerId} is not connected.`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove the disconnected user from the mapping
    for (const [userId, id] of Object.entries(userIdToSocketId)) {
      if (id === socket.id) {
        delete userIdToSocketId[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
const PORT = process.env.PORT || 3006;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
