const {Schema} = require('firefose');
const {Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array} = SchemaTypes;

const testSchema = new Schema({
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
        default: 1
    },
}, {timestamp: true});



const Test = new Model("tests", testSchema);

module.exports = Test;