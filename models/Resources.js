const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creat LinkSchema
const ResourcesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    res_id: {
        type: String
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Resources = mongoose.model('Resources', ResourcesSchema);

module.exports = Resources;
module.exports.Resources = Resources;