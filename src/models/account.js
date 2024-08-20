// This file contains all the rules for how the Account model is represented
// within our database
// Author: Daniel Manley

const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean} = SchemaTypes

// Define each field an account should have,
// the type is should be, whether or not it is required,
// and what the default value should be.
const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    first: {
        type: String,
        required: true,
       
    },
    last: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        default: [],
    }

}, {timestamp: true},
);

const account = new Model("accounts", accountSchema);

module.exports = account;