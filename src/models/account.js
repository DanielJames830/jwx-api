// This file contains all the rules for how the Account model is represented
// within our database
// Author: Daniel Manley

const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const member = require('./member');
const {String, Number, Array, Boolean} = SchemaTypes

// Define each field an account should have,
// the type is should be, whether or not it is required,
// and what the default value should be.
const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
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
    },
    credits: {
        type: Number,
        default: 0,
    }

}, {timestamp: true},
);

const account = new Model("accounts", accountSchema);

module.exports = account;