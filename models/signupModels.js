const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
});

const Registration = mongoose.model('Registration', registrationSchema, 'registrations');

module.exports = Registration;

