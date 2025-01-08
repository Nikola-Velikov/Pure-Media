const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Change to true for headless mode
    const page = await browser.newPage();

    // Set a higher default timeout for navigation
    page.setDefaultNavigationTimeout(60000); // 60 seconds

    const baseUrl = 'https://www.24chasa.bg/novini/vchera?page=';
    const totalPages = 15; // Update this to the total number of pages you want to scrape
    let results = [];
    const seenArticles = new Set(); // To keep track of unique articles

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        console.log(`Scraping page ${pageNum}`);
        await page.goto(`${baseUrl}${pageNum}`, { timeout: 60000 });

        // Wait for the grid items to load
        await page.waitForSelector('.grid-layout_with-image_and-meta');

        // Get all grid-layout-item elements
        const articles = await page.$$('main .container .main-grid section.news .grid-layout_with-image_and-meta .grid-layout-item');

        for (let i = 0; i < articles.length; i++) {
            console.log(`Opening article ${i + 1} on page ${pageNum}`);

            // Find the anchor inside the grid-layout-item
            const anchor = await articles[i].$('a');
            if (!anchor) {
                console.log(`No anchor found in article ${i + 1}`);
                continue;
            }

            // Get the href attribute
            const href = await page.evaluate(el => el.href, anchor);

            // Open the href in a new tab
            const newTab = await browser.newPage();
            newTab.setDefaultNavigationTimeout(60000); // Set timeout for new tab as well
            await newTab.goto(href, { timeout: 60000 });

            try {
                // Wait for the article content to load
                await newTab.waitForSelector('.article-content');

                // Extract the title and content
                const title = await newTab.$eval('main .title', el => el.textContent.trim());
                const content = await newTab.$eval('main .article-content', el => el.textContent.trim());

                // Create a unique key for the article
                const articleKey = `${title}-${content}`; // Combine title and content for uniqueness

                // Check if the article is already seen
                if (!seenArticles.has(articleKey)) {
                    seenArticles.add(articleKey); // Mark the article as seen
                    results.push(`Title ${title}: \n${content}\n\n`);
                    console.log(title);
                    
                } else {
                    console.log(`Duplicate article found: "${title}"`);
                }
            } catch (error) {
                console.log(`Error scraping article at ${href}: ${error.message}`);
            }

            // Close the new tab
            await newTab.close();
        }
    }

    // Save results to a text file
    fs.writeFileSync('scraped_articles.txt', results.join(''));
    console.log('Scraping completed. Data saved to scraped_articles.txt');

    await browser.close();
})();
