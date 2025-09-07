//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = `mongodb+srv://Sathyajothi:Sathyajothi@blockchainvotingsystem.tzse0ra.mongodb.net/?retryWrites=true&w=majority&appName=BlockchainVotingSystem`;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
module.exports = mongoose;