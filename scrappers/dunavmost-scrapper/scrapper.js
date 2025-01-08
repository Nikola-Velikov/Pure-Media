const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Change to true for headless mode
    const page = await browser.newPage();

    // Set a higher default timeout for navigation
    page.setDefaultNavigationTimeout(60000); // 60 seconds

    const baseUrl = 'https://www.dunavmost.com/Date/Yesterday';
    const totalPages = 5; // Replace with the total number of pages you want to scrape
    const visitedNews = new Set(); // To store unique news items
    const results = [];

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Scraping page ${currentPage}`);

        // Navigate to the base URL for the current page
        await page.goto(baseUrl, { timeout: 60000 });

        // Check if pagination is required and click on the appropriate page anchor
        const paginateSelector = '.paginate';
        const anchorExists = await page.evaluate((currentPage, paginateSelector) => {
            const pagination = document.querySelector(paginateSelector);
            return pagination && Array.from(pagination.querySelectorAll('a')).some(a => a.textContent.trim() === String(currentPage));
        }, currentPage, paginateSelector);

        if (anchorExists) {
            await page.evaluate((currentPage, paginateSelector) => {
                const pagination = document.querySelector(paginateSelector);
                const targetAnchor = Array.from(pagination.querySelectorAll('a')).find(a => a.textContent.trim() === String(currentPage));
                targetAnchor.click();
            }, currentPage, paginateSelector);

            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the page to load
        }

        // Wait for the list items to load
        await page.waitForSelector('.search-result-item li');
        const newsItems = await page.$$('.search-result-item li');

        for (const newsItem of newsItems) {
            const anchor = await newsItem.$('a'); // Find the anchor inside the `li`
            if (!anchor) continue;

            const href = await page.evaluate(a => a.href, anchor); // Get the href of the anchor
            console.log(`Navigating to: ${href}`);

            const newTab = await browser.newPage();
            newTab.setDefaultNavigationTimeout(60000); // Set timeout for the new tab as well

            try {
                await newTab.goto(href, { timeout: 60000 });

                // Wait for the article content to load
                await newTab.waitForSelector('#newstext h2');

                // Extract the title and content
                const newsData = await newTab.evaluate(() => {
                    const title = document.querySelector('#newstext h2')?.innerText.trim();
                    const paragraphs = Array.from(document.querySelectorAll('#newstext p')).map(p => p.innerText.trim());
                    return {
                        title,
                        text: paragraphs.join(' '),
                    };
                });

                if (newsData && newsData.title) {
                    const articleKey = `${newsData.title}-${newsData.text}`; // Create a unique key for the article

                    if (!visitedNews.has(articleKey)) {
                        visitedNews.add(articleKey); // Mark the article as seen
                        results.push(`Title ${newsData.title}: \n${newsData.text}\n\n`);
                    } else {
                        console.log(`Duplicate article found: "${newsData.title}"`);
                    }
                }
            } catch (error) {
                console.error(`Failed to scrape article: ${error.message}`);
            } finally {
                await newTab.close();
            }
        }
    }

    // Save results to a text file
    fs.writeFileSync('scraped_news.txt', results.join('\n\n'));
    console.log('Scraping completed. Data saved to scraped_news.txt');

    await browser.close();
})();
