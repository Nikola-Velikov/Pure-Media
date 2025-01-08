const Matches = require("../models/matches");
const News = require("../models/news");
const { getAll, create, getById } = require("../services/blogService");
const newsController = require('express').Router();
const fs = require('fs');
const path = require('path');

// Read the yellow words and phrases from the file
const getYellowWordsFromFile = () => {
    const filePath = path.join(__dirname, '..', 'words.txt');
    // Adjust the path to your file
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split('\n').map(phrase => phrase.trim().toLowerCase())
         // Split by new line and clean up
    } catch (err) {
        console.error('Error reading the yellow words file:', err);
        return []; // Return an empty array if the file read fails
    }
};

const yellowWords = getYellowWordsFromFile();


const highlightYellowMediaWords = (text, phrases) => {
    const highlightEnabled = false; 

    return phrases.reduce((score, phrase) => {
        // Check if the phrase is a single word
        const isSingleWord = !/\s/.test(phrase);

        // Use regex for single words or include directly for phrases
        const regex = isSingleWord
            ? new RegExp(`(?<!\\w)${phrase}(?!\\w)`, "gi") // Match whole words only
            : new RegExp(phrase, "gi"); // Match phrases anywhere

        // If a match is found, increment the score
        if (regex.test(text)) {
            score += 1; // Increment score if yellow word is found
        }

        return score; // Return the score for this text
    }, 0); // Start score at 0
    
};

newsController.get('/score', async (req, res) => {
    try {
        const allNews = await News.find({});

        let mediaStats = {};

        allNews.forEach(news => {
            if(news.media!="BTA"){
            if (!mediaStats[news.media]) {
                mediaStats[news.media] = {
                    yellowNewsCount: 0,
                    totalNewsCount: 0,
                };
            }

            // Increment the total news count for this media outlet
            mediaStats[news.media].totalNewsCount++;

            const titleScore = highlightYellowMediaWords(news.title, yellowWords);
          
            const descriptionScore = highlightYellowMediaWords(news.description, yellowWords);

            // If either title or description contains yellow words, increment yellow news count
            if (titleScore > 1 || descriptionScore > 1) {
                mediaStats[news.media].yellowNewsCount++;
                if(news.media=="pik"){
                    console.log(news.title);
                    
                }
            }
        }
        });

        // Prepare response format with yellow news count and total news count
        const response = Object.keys(mediaStats).map(media => {
            return {
                media,
                stats: [
                    mediaStats[media].yellowNewsCount, // yellow news count
                    mediaStats[media].totalNewsCount   // total news count
                ]
            };
        });

        // Return the stats for each media
        res.status(200).send({
            success: true,
            result: response,
            totalNews: allNews.length,
        });

    } catch (err) {
        res.status(400).send({
            success: false,
            error: err.message,
        });
    }
});
newsController.get('/', async (req, res) => {
    try {
        const limit = req.query.limit || 10; // Default limit to 10 if not provided
        const page = req.query.page || 1;   // Default page to 1 if not provided
        const fromDate = req.query.fromDate; // New query parameter for filtering start date
        const toDate = req.query.toDate;   // New query parameter for filtering end date

        // Build the filter object
        const filter = { 
            media: 'BTA',
        };

        // Add date range filtering if provided
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                filter.createdAt.$lte = new Date(toDate);
            }
        }

        // Find all BTA news IDs that are in the Matches schema
        const matchedNewsIds = await Matches.find({})
            .distinct('btaNewId'); // Get distinct BTA news IDs
        filter._id = { $in: matchedNewsIds }; // Filter by matched news IDs

        // If 'limit' is 'all', return all matching news from BTA
        if (limit === 'all') {
            const allNews = await News.find(filter);
            return res.status(200).send({
                success: true,
                result: allNews,
                totalPages: 1,
                currentPage: 1,
            });
        }

        // Count the total number of matching news articles from BTA
        const totalNews = await News.countDocuments(filter);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalNews / limit);

        // Get the matching news for the current page
        const news = await News.find(filter)
            .skip((page - 1) * limit)  // Skip previous pages
            .limit(Number(limit));    // Limit the number of results

        res.status(200).send({
            success: true,
            result: news,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err.message,
        });
    }
});


// blogController.post('/create',upload.single('image') ,async (req, res) => {
//     console.log('create',req.file.filename);
//     try {
//         const token = req.headers["x-authorization"];
//         const user = verifyToken(token)
//         const payload = {
//             title: req.body.title,
//             shortcont: req.body.shortcont,
//             context: req.body.context,
//             imageUrl: req.file.filename,
//             userId: user._id,
//             username: user.username,

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
newsController.get('/:id', async (req, res) => {
    try {
        const newsId = req.params.id;

        // Fetch the news item by ID
        const newsItem = await News.findById(newsId).select('title description media createdAt image_url');

        if (!newsItem) {
            return res.status(404).send({
                success: false,
                message: 'News item not found',
            });
        }

        // Fetch matches where btaNewId matches the news ID
        const matches = await Matches.find({ btaNewId: newsId })
            .populate('matchNewId', 'title description media createdAt _id image_url'); // Populate matched news details, including media

        // Format the result
        const result = {
            title: newsItem.title,
            description: newsItem.description,
            media: newsItem.media,
            createdAt: newsItem.createdAt,
            image_url: newsItem.image_url || null,
            matches: matches.map(match => ({
                title: match.matchNewId?.title || null,
                description: match.matchNewId?.description || null,
                media: match.matchNewId?.media || null, 
                createdAt: match.matchNewId?.createdAt || null,
                _id: match.matchNewId?._id || null,
                image_url: match.matchNewId?.image_url || null
            })),
        };

        res.status(200).send({
            success: true,
            result,
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err.message,
        });
    }
});


module.exports = newsController;