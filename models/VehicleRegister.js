const mongoose = require('mongoose');

const vehicleRegisterSchema = new mongoose.Schema({
    vehicleMake: String,
    vehicleModel: String,
    registrationNumber: String,
    vehicleImage: String,
    vehicleType: String, // Add vehicle type field
    userName: String,
    userEmail: String,
    location: String,
    phoneNumber: String,
    cost: Number
});

const VehicleRegister = mongoose.model('VehicleRegister', vehicleRegisterSchema);

module.exports = VehicleRegister;
