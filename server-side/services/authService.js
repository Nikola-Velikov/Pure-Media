// const User = require('../models/users.js');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Comments = require('../models/comments.js');
// const Blog = require('../models/blog.js');
// const Cars = require('../models/cars.js');



// const JST_SECRET = '0WIMu2TA}u(De1/Ga{wneQl`1*m:bX5BIiVVG}^l%G=8z!x~X#QwbhExLbF?ZQMlB?7A_0xOGhhbqn}uwO,CMf%ilJ/F';

// async function register({email, username, password}) {
//     const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
//     if (existingEmail) {
//         throw new Error('Email Taken!');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//         email,
//         hashedPassword,
//         username,
        
//     });

//     const result = createSession(user);

//     return result;
// }

// async function createSession({ _id, email, username}) {
//     const payload = {
//         _id,
//         email, 
//         username,
        
//     }

//     const token = jwt.sign(payload, JST_SECRET);

//     payload.token = token;

//     return payload;
// }

// async function getAllUsers() {
//     const result = User.find({}).lean();
//     return result;
// }

// async function getUserById(id) {
//     return User.findById(id).lean();
// }

// async function login({email, password}) {
//     const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
//     if (!user) {
//         throw new Error('Incorrect email or password!');
//     }
    
//     const hasMatch = await bcrypt.compare(password, user.hashedPassword);
    
//     if (!hasMatch) {
//         throw new Error('Incorrect email or password!');
//     }
//     return await createSession(user);
// }

// function verifyToken(token) {
//     return jwt.verify(token, JST_SECRET);
// }

// async function getById(id) {
//     return User.findById(id).lean();
// }

// async function updateProfile(id, user) {
//     const existing = await User.findById(id);

//     if(!existing){
//         throw new Error("User doesn't exist");
//     }

//     existing.username = user.username;
//     existing.email = user.email;
   

//     const comments = Comments.find({userId: id});
//     await comments.updateMany({ userId: id }, {
//         $set: {
//             username: user.username,
//         }
//     });
//     const blogs = Blog.find({userId: id});
//     await blogs.updateMany({ userId: id }, {
//         $set: {
//             username: user.username,
//         }
//     });
//     const updatedUser = await existing.save();

//     return createSession(updatedUser);
// }

// async function changePassword(id, req){
//     const user = await User.findById(id);
//     const match = await bcrypt.compare(req.oldPassword, user.hashedPassword);
//     if (!match) {
//         throw new Error('Old password doesn\'t match');
//     }
    
//     user.hashedPassword = await bcrypt.hash(req.newPassword, 10);
    
//     return await user.save();
// }

// async function deleteById(id) {
//     await User.findOneAndDelete({ _id: id });
//     await Comments.deleteMany({ userId: id});
//     await Blog.deleteMany({ userId: id});
//     return  await Cars.deleteMany({ owner: id});
    

//   }
// module.exports = {
//     register: register,
//     getAllUsers: getAllUsers,
//     getUserById: getUserById,
//     login: login,
//     verifyToken:verifyToken,
//     getById: getById,
//     updateProfile: updateProfile,
//     changePassword:changePassword,
//     deleteById: deleteById
// }
