const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Change to true for headless mode
    const page = await browser.newPage();

    // Set a higher default timeout for navigation
    page.setDefaultNavigationTimeout(60000); // 60 seconds

    const baseUrl = 'https://bnr.bg/search/archive/';
    const totalPages = 1; // Update this to the total number of pages you want to scrape
    let results = [];
    const seenNews = new Set(); // To keep track of unique news articles

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        console.log(`Scraping page ${pageNum}`);
        await page.goto(`${baseUrl}?news-yesterday=${pageNum}`, { timeout: 60000 });

        // Wait for the rows to load
        await page.waitForSelector('.row-fluid');

        // Get all row elements
        const rows = await page.$$('.row-fluid');

        for (let i = 0; i < rows.length; i++) {
            console.log(`Opening row ${i + 1} on page ${pageNum}`);

            // Find the anchor inside the h3
            const anchor = await rows[i].$('h3 a');
            if (!anchor) {
                console.log(`No anchor found in row ${i + 1}`);
                continue;
            }

            // Get the href attribute
            const href = await page.evaluate(el => el.href, anchor);

            // Open the href in a new tab
            const newTab = await browser.newPage();
            newTab.setDefaultNavigationTimeout(60000); // Set timeout for new tab as well
            await newTab.goto(href, { timeout: 60000 });

            // Wait for the article to load
            await newTab.waitForSelector('[itemprop="articleBody"]');

            // Extract the title and content
            const title = await newTab.$eval('[itemprop="name"]', el => el.textContent.trim());
            const content = await newTab.$eval('[itemprop="articleBody"]', el => el.textContent.trim());

            // Create a unique key for the article
            const articleKey = `${title}-${content}`; // Combine title and content for uniqueness

            // Check if the article is already seen
            if (!seenNews.has(articleKey)) {
                seenNews.add(articleKey); // Mark the article as seen
                results.push(`Title ${title}: \n${content}\n\n`);
            } else {
                console.log(`Duplicate article found: "${title}"`);
            }

            // Close the new tab
            await newTab.close();
        }
    }

    // Save results to a text file
    fs.writeFileSync('scraped_data.txt', results.join(''));
    console.log('Scraping completed. Data saved to scraped_data.txt');

    await browser.close();
})();
