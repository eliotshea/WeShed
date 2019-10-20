
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// Instantiating the express app
const app = express();

app.use(cors());
app.use(morgan('dev'));

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const routes = require('./routing/mapping');
app.use('/', routes);


// Starting the app on PORT
const PORT = 4000;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Listening on port ${PORT}`);
});

