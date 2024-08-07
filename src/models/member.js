const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, Boolean} = SchemaTypes;
const uuid = require('uuid');


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
        type: Number,
        default: 1,
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
    lastClockInTime: {
        type: Number,
    }

}, {timestamp: true});



const member = new Model("members", memberSchema);

module.exports = member;