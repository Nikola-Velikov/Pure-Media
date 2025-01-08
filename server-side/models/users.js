// const { Schema, model } = require("mongoose");

// const userSchema = new Schema({
//     hashedPassword: { type: String, required: true },
//     email: { type: String, required: true, unique: true }, 
//     username: { type: String, required: true },
  
// });

// userSchema.index({ email: 1 }, {
//     options: {
//         collation: {
//             locale: 'en',
//             strength: 2,
//         }
//     }
// });
// const Users = model('Users', userSchema);
// module.exports = Users;