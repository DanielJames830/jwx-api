// This file contains all the rules for how the Project Pack model is represented
// within our database
// Author: Daniel Manley


const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean, Date} = SchemaTypes;
const uuid = require('uuid');

const projectPackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pack_id: {
        type: String,
        required: true
    },
    badges: {
        type: Array,
        default: [],
    }
}, {timestamp: true});



const projectPack = new Model("project_packs", projectPackSchema);

module.exports = projectPack;