var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegisterSchema = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,

});

module.exports = mongoose.model('Register', RegisterSchema);