// const { register, getAllUsers, getUserById, login, getById,updateProfile, changePassword, deleteById, verifyToken } = require('../services/authService');
// const authContoller = require('express').Router();


// authContoller.post('/register', async function (req, res) {
//     console.log('POST /register',req.body);
//     try {
//         const payload = {
//             email: req.body.email,
//             username: req.body.username,
//             password: req.body.password,
            
//         }
//         const user = await register(payload);
//         res.send(JSON.stringify({
//             result: user,
//             success: true,
//         }));
//     } catch (err) {
//         console.log(err.message);
//         res.send(JSON.stringify({
//             success: false,
//             error: err.message,
//         }));
//     }
// });

// authContoller.post('/login', async (req, res) => {
//     console.log('logingggg');
//     const loginUser = {
//         email: req.body.email,
//         password: req.body.password,
//     }
//     try {
//         const user = await login(loginUser);
//         res.send({
//             success: true,
//             result: user,
//         })

//     } catch (err) {
//         res.send({
//             success: false,
//             error: err.message
//         })
//     }

// })

// authContoller.get('/users/:id', async (req, res) => {
//     console.log('GET /users/:id');
//     const user = await getUserById(req.params.id);
//     res.send({ success: true, result: user });
// });

// authContoller.post('/users/:id/edit', async (req, res) => {
// console.log(req.body);
//     try {
//         const payload = {
//             username: req.body.username,
//             email: req.body.email
//         }
//         const user = await updateProfile(req.params.id, payload);
//         res.send(JSON.stringify({
//             result: user,
//             success: true,
//         }));
//     } catch (err) {
//         console.log(err.message);
//         res.send(JSON.stringify({
//             success: false,
//             error: err.message,
//         }));
//     }
// });

// authContoller.post('/users/:id/changepass', async (req, res) => {
   
//     try{ 
//         const result = await changePassword(req.params.id, req.body);
//         res.status(200).send({
//             success: true,
//             result: result
//         });
//     } catch (err) {
//         res.status(400).send({
//             success: false,
//             error: err.message
//         })
//     }
// });
// authContoller.get('/:id/delete', async (req, res) => {
   
//     try {
//         console.log(req.params.id);
//         const token = req.headers["x-authorization"];
//         verifyToken(token);
//         const result = await deleteById(req.params.id);
//         res.status(200).send({
//             success: true,
//             result: result
//         });
//     } catch (err) {
//         res.status(400).send({
//             success: false,
//             error: err.message
//         })
//     }
// });


// module.exports = authContoller;