const {Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: { type: String, required: true }, // Add media type as per your need (String for a link or other)
    createdAt: {
      type: Date,
      default: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Set to the previous day
        return yesterday;
      },
    },
    image_url: { type: String }
  },
  { timestamps: true } // Automatically adds updatedAt
);

const News = model('News', newsSchema);

module.exports = News;
