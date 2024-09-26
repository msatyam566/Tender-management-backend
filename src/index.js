const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const appRoutes = require('./routes/index');
const app = express();

const port = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000', // Replace with your allowed origin
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));


app.use(bodyParser.json());



// Import routes
app.use('/', appRoutes);

// Root route
app.get('/', (req, res) => {
    return res.status(200).send({ message: 'Bids management' });
});

const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Same CORS settings for Socket.IO
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

app.set("socketio",io) // setup the socket in app
    
// Connect to MongoDB and start the server
mongoose
    .connect('mongodb+srv://satyam28147:bmd6WzxcwS9yw3Kb@cluster0.q43lt.mongodb.net/')
    .then(() => {
        console.log('MongoDB connected');
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
