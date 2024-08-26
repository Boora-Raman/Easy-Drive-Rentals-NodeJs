const express = require('express');
const router = express.Router();
const multer = require('multer');
const VehicleRegister = require('../models/VehicleRegister');
const Registration = require('../models/signupModels');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.message = "Logged out successfully!";
    res.redirect('/');
});

// Route handler for vehicle registration
router.post('/register', upload.single('vehicleImage'), async (req, res) => {
    try {
        const newVehicle = new VehicleRegister({
            vehicleMake: req.body.vehicleMake,
            vehicleModel: req.body.vehicleModel,
            registrationNumber: req.body.registrationNumber,
            vehicleImage: req.file.filename, // Store the filename
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            location: req.body.location,
            phoneNumber: req.body.phoneNumber,
            cost: req.body.cost
        });
        await newVehicle.save();
        res.redirect('/vehicles');
    } catch (error) {
        console.error('Error saving vehicle:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for displaying registered vehicles
router.get('/vehicles', async (req, res) => {
    try {
        const loggedIn = req.session.loggedIn;
        let message = '';

        let username = 'Log in'; // Default value for username

        if (loggedIn) {
            message = 'Logged in successfully!';
            const user = req.session.user;
            username = user.username;
        } else {
            message = 'You are logged out.';
        }

        const vehicles = await VehicleRegister.find();
        res.render('registeredvehicles', { vehicles, loggedIn, username, message });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/rent", async (req, res) => {
    try {
        const loggedIn = req.session.loggedIn;
        let message = '';

        let username = 'Log in'; // Default value for username

        if (loggedIn) {
            message = 'Logged in successfully!';
            const user = req.session.user;
            username = user.username;
        } else {
            message = 'You are logged out.';
        }

        res.render('rent', { loggedIn, username, message });
    } catch (error) {
        console.error('Error rendering rent page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const existingUserByEmail = await Registration.findOne({ email: email });

        if (existingUserByEmail) {
            return res.redirect('/signup?message=Email%20already%20exists');
        }

        const newRegistration = new Registration({ name, username, email, password });
        await newRegistration.save();
        res.redirect('/login');
    } catch (err) {
        console.error('Error saving registration:', err.message);
        res.redirect('/signup');
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Registration.findOne({ email: email });

        if (!user || password != user.password) {
            return res.status(400).redirect('/login?message=Invalid%20credentials');
        }

        req.session.loggedIn = true;
        req.session.user = user; // Store user information in session
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).redirect('/login?message=Internal%20Server%20Error');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get("/", async (req, res) => {
    try {
        const loggedIn = req.session.loggedIn;
        let message = '';

        let username = 'Log in'; // Default value for username

        if (loggedIn) {
            message = 'Logged in successfully!';
            const user = req.session.user;
            username = user.username;
        } else {
            message = 'You are logged out.';
        }

        res.render('index', { loggedIn, username, message });
    } catch (error) {
        console.error('Error rendering home page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/register", async (req, res) => {
    try {
        const loggedIn = req.session.loggedIn;
        let message = '';

        let username = 'Log in'; // Default value for username

        if (loggedIn) {
            message = 'Logged in successfully!';
            const user = req.session.user;
            username = user.username;
        } else {
            message = 'You are logged out.';
            res.render('index', { loggedIn, username : 'Log In ', message });
        }

        res.render('register', { loggedIn, username, message });
    } catch (error) {
        console.error('Error rendering register page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;
