// This file contains all the rules for how the Promotion model is represented
// within our database
// Author: Daniel Manley


const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean} = SchemaTypes;

// Define each field an account should have,
// the type is should be, whether or not it is required,
// and what the default value should be.
const promotionSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    
}, {timestamp: true});



const promotion = new Model("promotions", promotionSchema);

module.exports = promotion;