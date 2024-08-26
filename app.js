const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes'); // Assuming routes file is in the same directory
// Accessing the environment variable
// const Url = process.env.mongooseUrl;

// console.log('My Variable:', myVariable);


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb+srv://booraraman2004:ramanBoora@cluster0.xaz6fpx.mongodb.net/RentalData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

app.use('/', routes);

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
