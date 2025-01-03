const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const port = 5000;
const app = express();

// connect to mongoDB
connectToMongo();

// middleware
app.use(cors());
app.use(express.json());

// available routes
app.use('/auth', require('./routes/auth'));
app.use('/canvas', require('./routes/canvas'));

// default port
app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
    // res.send('Hello World!');
});