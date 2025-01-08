// const { verifyToken } = require("../services/authService");
// const { create, deleteComment } = require("../services/commentService");
// const commentsContorller = require('express').Router();

// commentsContorller.post('/:id', async (req, res) => {
    
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         req.body = {
//             ...req.body,
//             userId: user._id,
//             offerId: req.params.id,
//             username: user.username,
            
//         }
//         const result = await create(req.body);
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


// commentsContorller.get('/:id/delete', async (req, res) => {
   
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         const result = await deleteComment(req.params.id);
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

// module.exports = commentsContorller;