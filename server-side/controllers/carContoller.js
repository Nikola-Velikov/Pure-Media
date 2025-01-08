// const Cars = require("../models/cars");
// const { verifyToken } = require("../services/authService");
// const { getAll, create, getById, update, deleteById, getGamesByUserId } = require("../services/carService");
// const carController = require('express').Router();
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// carController.get('/', async (req, res) => {
 
//     try {
        
//         const result = await getAll();
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
// })

// carController.get('/user/:id', async (req, res) => {
   
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         const result = await getGamesByUserId(req.params.id);
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
// })

// carController.post('/create',upload.single('image') ,async (req, res) => {
//     console.log('create',req.body);
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         const payload = {
//             model: req.body.model,
//             price: req.body.price,
//             mileage: req.body.mileage,
//             color: req.body.color,
//             carImage: req.file.filename,
//             description: req.body.description,
//             fuel: req.body.fuel,
//             telephone:req.body.telephone,
//             seats:req.body.seats,
//             owner: user._id,
          
//         }
//         const result = await create(payload);
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
// })
// carController.get('/:id', async (req, res) => {
//     console.log('GET /games/:id');
//     try {
//         const token = req.headers["x-authorization"];
//       verifyToken(token);
//         const result = await getById(req.params.id);
        
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
// })

// carController.post('/:id/edit',upload.single('image') ,async (req, res) => {
//     console.log('POST /games/:id/edit',req.body);
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         const payload = {
//             model: req.body.model,
//             price: req.body.price,
//             mileage: req.body.mileage,
//             color: req.body.color,
//             carImage: req.file.filename,
//             description: req.body.description,
//             fuel: req.body.fuel,
//             telephone:req.body.telephone,
//             seats:req.body.seats,
//             owner: user._id,
          
//         }
//         console.log(payload);
//         const result = await update(req.params.id,payload);
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

// carController.get('/:id/delete', async (req, res) => {
//     console.log('GET /games/:id/delete');
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
// module.exports = carController;