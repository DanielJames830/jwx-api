// This file contains all the rules for how the Tech Track model is represented
// within our database
// Author: Daniel Manley


const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean, Date} = SchemaTypes;

const badgeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    badge_id: {
        type: String,
        required: true,
    }
}, {timestamp: true});



const badge = new Model("badges", badgeSchema);

module.exports = badge;