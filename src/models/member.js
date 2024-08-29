// This file contains all the rules for how the Member model is represented
// within our database
// Author: Daniel Manley


const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean, Date} = SchemaTypes;
const uuid = require('uuid');

// Define each field an account should have,
// the type is should be, whether or not it is required,
// and what the default value should be.
const memberSchema = new Schema({
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    born: {
        type: Date,
        required: true,
    },
    renewDate: {
        type: Number,
        required: true,
    },
    isClockOut: {
        type: Boolean,
        default: false,
    },
    monthlyTimeRemaining: {
        type: Number,
        default: 0
    },
    completedProjects: {
        type: Array,
        default: []
    },
    isMembershipActive: {
        type: Boolean,
        default: false,
    },
    clockInTimes: {
        type: Array,
        default: [],
    },
}, {timestamp: true});



const member = new Model("members", memberSchema);

module.exports = member;