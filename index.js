// server.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const connection = require("./db");
const { User } = require("./modals/Logins/UserLogin")
const userRoutes =require('./Routes/RouteLogins/User')

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);
// app.use('/uploads', express.static('uploads')); 
// Connect to MongoDB
connection();

// app.use(cors({
//   origin: ['http://localhost:3005', 'https://imdfx-newserver-rwes-i8f9pec94-mohammadikram008s-projects.vercel.app'],
//   // other CORS options...
// }));
// CORS handling
// app.use((req, res, next) => {
//   // Allow requests from any origin
//   res.header('Access-Control-Allow-Origin', '*');
//   // Specify the headers that can be used during the actual request
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.use((req, res, next) => {
  
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// const router = require("./Routes/RouteLogins/User");
// app.get('/', async (req, res) => {
//   res.send("heloo")
// });
// app.post('/login', async (req, res) => {
//   console.log("login api call");
//     try {
//       const { email, password } = req.body;
//       // console.log(" email, password", email, password)
//       const user = await User.findOne({ email }).exec();
  
//       if (!user) {
//         return res.status(404).json('User not found');
//       }
  
//       if (user.password !== password) {
//         return res.status(401).json('Invalid password');
//       }
//       // const secretKey = generateSecretKey();
//       // console.log(secretKey);
  
//       // const token = jwt.sign({ email: user._id }, secretKey);
//       // console.log(token);
//       res.status(200).json(user._id);
//     } catch (error) {
//       res.status(500).json('Error finding user');
//       console.log("error",error);
//     }
//   });

 



// const User = mongoose.model('User', userSchema);
// // Middleware to parse incoming JSON requests
// app.use(bodyParser.json());

// // Login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   // Find the user by username in MongoDB
//   const user = await User.findOne({ username });

//   // If the user is not found, return an error
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid username or password' });
//   }

//   // Compare the provided password with the hashed password in the database
//   const passwordMatch = await bcrypt.compare(password, user.password);

//   // If the passwords match, login successful
//   if (passwordMatch) {
//     return res.json({ message: 'Login successful' });
//   } else {
//     // If passwords do not match, return an error
//     return res.status(401).json({ error: 'Invalid username or password' });
//   }
// });

// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
