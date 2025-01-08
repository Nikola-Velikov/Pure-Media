// const Blog = require("../models/blog");
// const Cars = require("../models/cars");
// const Comments = require("../models/comments");
// //const Comments = require("../models/comments");

// async function getAll() {
//   return await Cars.find({});
// }

// async function create(offer) {
//   return await Cars.create(offer);
// }

// async function update(id, offer) {
//   const existing = await Cars.findById(id);

//   if (!existing) {
//     throw new Error("Car offer doesn't exist");
//   }

//   existing.model = offer.model;
//   existing.description = offer.description;
//   existing.fuel = offer.fuel;
//   existing.price = offer.price;
//   existing.mileage = offer.mileage;
//   existing.color = offer.color;
//   existing.seats = offer.seats;
//   existing.telephone = offer.telephone;
//   console.log(offer);
//   existing.carImage = offer.carImage;

//   return await existing.save();
// }

// async function getById(id) {
//   const offer = await Cars.findById(id).lean();
//   offer.comments = await Comments.find({ offerId: id }).lean();
//   return offer;
// }

// async function deleteById(id) {
//   await Cars.findOneAndDelete({ _id: id });
//   // return await Comments.deleteMany({ offerId: id});
// }

// async function getGamesByUserId(id) {
//   const offers = await Cars.find({ owner: id }).lean();
//   const blogs = await Blog.find({ userId: id }).lean();
//   return { offers, blogs };
// }
// module.exports = {
//   create,
//   update,
//   getAll,
//   getById,
//   deleteById,
//   getGamesByUserId: getGamesByUserId,
// };
