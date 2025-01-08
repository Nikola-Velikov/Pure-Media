const Blog = require("../models/news");
const Comments = require("../models/matches");

async function getAll() {
    return await Blog.find({media:'BTA'});
}

async function create(blog) {
    return await Blog.create(blog);
}


async function getById(id) {
    const offer = await Blog.findById(id).lean();
    offer.comments = await Comments.find({ offerId: id}).lean();
    return offer;
}


module.exports = {
    create,
    getAll,
    getById,
   
}