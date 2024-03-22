const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    Amount: {type: String, required: false }

});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = { Wallet };
