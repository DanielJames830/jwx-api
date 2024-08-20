const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const member = require('./member');
const {String, Number, Array, Boolean} = SchemaTypes

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