// const http = require("http");
// const fs = require("fs");

// const server = http.createServer((req, res) => {
//     if(req.url === "/"){
//         res.writeHead(200, { "Content-Type": "text/plain" });
//         res.end("Welcome to Home Page");
//     } else if(req.url === "/index.html"){
//         fs.readFile("index.html", "utf-8", (err, data) => {
//             if(err){
//                 res.writeHead(500, { "Content-Type": "text/plain" });
//                 res.end("Error reading file");
//             } else {
//                 res.writeHead(200, { "Content-Type": "text/html" });
//                 res.end(data);
//             }
//         });
//     } else if(req.url === "/login.html"){
//         fs.readFile("login.html", "utf-8", (err, data) => {
//             if(err){
//                 res.writeHead(500, { "Content-Type": "text/plain" });
//                 res.end("Error reading file");
//             } else {
//                 res.writeHead(200, { "Content-Type": "text/html" });
//                 res.end(data);
//             }
//         });
//     } else {
//         res.writeHead(404, { "Content-Type": "text/plain" });
//         res.end("Page not found");
//     }
// });

// const PORT = 5010;
// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });























































const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5009; 

// Body parser
app.use(express.urlencoded({ extended: true }));

// Point to the root directory where the files are
app.use(express.static(path.join(__dirname)));

// Corrected: Only one mongoose.connect() call, using the environment variable
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas connected!"))
.catch(err => console.log("Error connecting to MongoDB:", err));

// User schema & model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    gender: String
});
const User = mongoose.model('User', userSchema);

// Routes
// Point directly to index.html in the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Point directly to login.html in the root
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, mobile, gender } = req.body;
    try {
        const newUser = new User({ name, email, password, mobile, gender });
        await newUser.save();
        console.log("Data saved in MongoDB Atlas:", newUser);
        res.send("Signup successful! Data saved in MongoDB Atlas.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});