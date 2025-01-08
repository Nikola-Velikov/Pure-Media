const mongoose = require('mongoose');

const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/pure-media-production';

module.exports = async function(app) {
    try{
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log('Connected to DB');
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}