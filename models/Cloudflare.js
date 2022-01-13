const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creat Cloudflare
const CloudflareSchema = new mongoose.Schema({
    name: {
        type: String
    },
    ZoneID: {
        type: String
    },
    AccountID: {
        type: String
    },
    email: {
        type: String
    },
    api_key: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Cloudflare = mongoose.model('Cloudflare', CloudflareSchema);

module.exports = Cloudflare;
module.exports.Cloudflare = Cloudflare;