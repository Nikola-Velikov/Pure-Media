const {Schema, model, Types } = require("mongoose");

const matchesSchema = new Schema({
    btaNewId: { type: Types.ObjectId, ref: 'News' },
    matchNewId: { type: Types.ObjectId, ref: 'News' },
},{ timestamps: true }
);

const Matches = model('NewsMatches', matchesSchema);

module.exports = Matches;
