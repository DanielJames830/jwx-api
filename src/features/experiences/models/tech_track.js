// This file contains all the rules for how the Tech Track model is represented
// within our database
// Author: Daniel Manley


const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean, Date} = SchemaTypes;
const uuid = require('uuid');

const techTrackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    track_id: {
        type: String,
        required: true
    },
    projects: {
        type: Array,
        default: [],
    }
}, {timestamp: true});



const techTrack = new Model("tech_tracks", techTrackSchema);

module.exports = techTrack;