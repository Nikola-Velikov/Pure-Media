const express = require('express');
const mongoose = require('mongoose');
const routesConfig = require('./config/routes.js');
const databaseConfig = require('./config/database.js');
const path = require('path');
const News = require('./models/news.js');
const fs = require('fs');
const Matches = require('./models/matches.js');
// const uploadData = async () => {
//     try {
//         console.log(1);
//         const data = JSON.parse(fs.readFileSync('news.json', 'utf-8'));
//         const formattedData = data.map(item => {
//             return {
//                  btaNewId : item.btaNewId ? new mongoose.Types.ObjectId(item.btaNewId.$oid) : undefined,
//                  matchNewId :item.matchNewId ? new mongoose.Types.ObjectId(item.matchNewId.$oid) : undefined,
//                  createdAt : item.createdAt ? new Date(parseInt(item.createdAt.$date.$numberLong)) : undefined,
//                  updatedAt: item.updatedAt ? new Date(parseInt(item.updatedAt.$date.$numberLong)) : undefined
    
//             };
//         });
        
//         await Matches.insertMany(formattedData);
//         console.log('Data uploaded successfully!');
//     } catch (error) {
//         console.error('Upload error:', error);
//     } 
// };

start();

async function start() {
    const app = express();

    await databaseConfig(app);
    routesConfig(app);
   // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.listen(3000, () => { console.log('App listening on port 3000') });

    //await Matches.deleteMany({});
   //  await uploadData()
  
    const findNewsByTitleAndMedia = async (title, media) => {
        try {
            const news = await News.findOne({ title: title, media: media });
            return news;
        } catch (err) {
            console.error('Error finding news:', err);
            return null;
        }
    };

 const matchesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'matches.json'), 'utf-8'));

        // Loop through each match
        for (const match of matchesData) {
            // 1. Find the 'BTA' news article based on the title and media
            const btaNews = await findNewsByTitleAndMedia(match.title, 'BTA');
            
            
            if (btaNews) {
                // 2. For each match, find the related news article by description and media
                for (const matchItem of match.matches) {
                    //console.log(matchItem.content);
                    
                    const matchNews = await News.findOne({
                        title: matchItem.title, // Assuming you match by content/description
                        media: matchItem.media
                    });

                   

                    if (matchNews) {
                       //console.log(matchNews);
                       
                        
                        // 3. Create a new entry in the Matches collection
                        const newMatch = new Matches({
                            btaNewId: btaNews._id,
                            matchNewId: matchNews._id
                        });
                        
                    
                      // await newMatch.save();
                    }else{
                       // console.log(matchNews);
                        
                    }
                }
            }
        }
//     async function saveNews(title, description, mediaName, image_url) {
//         try {
//             const news = new News({
//                 image_url: image_url,
//                 title: title,
//                 description: description,
//                 media: mediaName,
//                 createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) // Set the createdAt to the previous day
//             });
    
//             await news.save();
//             console.log(`Saved news: ${title}`);
//         } catch (err) {
//             console.error('Error saving news:', err);
//         }
//     }
    
//     // Read the file and parse news
//     function parseNewsFile(filePath, mediaName) {
//         fs.readFile(filePath, 'utf8', async (err, data) => {
//             if (err) {
//                 console.error('Error reading the file:', err);
//                 return;
//             }
    
//             // Split the file content by "Title"
//             const newsItems = data.split('Title');
            
//             // Process each news item
//             for (const item of newsItems) {
//                 // Trim extra spaces and check if item is valid
//                 const trimmedItem = item.trim();
//                 if (trimmedItem.length === 0) continue;
    
//                 // Find the position of the colon (:) to separate title and description
//                 const colonIndex = trimmedItem.indexOf(':');
//                 if (colonIndex !== -1) {
//                     const firstTitle = trimmedItem.substring(0, colonIndex).trim();
//                     let title = "";
//                     let image_url = "";
//                     if (firstTitle.includes(";;;")) {
//                         const splitTitle = firstTitle.split(";;;");
//                         title = splitTitle[0]
//                         image_url = splitTitle[1]
//                     }else{
//                         title = firstTitle
//                     }
//                     const description = trimmedItem.substring(colonIndex + 1).trim();
    
//                     // Save the news to the database
//                     await saveNews(title, description, mediaName, image_url);
//                 }
//             }
    
//             console.log('All news items have been processed.');
//         });
//     }
    
//     const filePath = path.join(__dirname, 'all_news.txt');
    
//     const mediaName = '24chasa';
    
//     parseNewsFile(filePath, mediaName);
 }
