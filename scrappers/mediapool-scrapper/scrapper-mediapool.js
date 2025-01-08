const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to get the previous day's date in the format YYYY-MM-DD
function getPreviousDay() {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Open the base URL
  await page.goto('https://www.mediapool.bg/today.html', { waitUntil: 'networkidle2' });

  // Set the date to the previous day
  const previousDay = getPreviousDay();
  await page.evaluate((date) => {
    document.querySelector('#rdate').value = date;
  }, previousDay);

  // Wait for the submit button to be visible and then click it
  await page.waitForSelector('button.c-button.c-button_primary.c-button_wide[type="submit"]', { visible: true });

  // Using JavaScript to trigger a click on the submit button
  await page.evaluate(() => {
    document.querySelector('button.c-button.c-button_primary.c-button_wide[type="submit"]').click();
  });

  // Wait for the page to load after form submission
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Select all article links in the list
  const articleLinks = await page.$$eval(
    '.l-grid__cell.l-grid__cell_size_50.l-grid__cell_size-tiny_100 a',
    links => links.map(link => link.href)
  );

  // Prepare the file
  const filePath = 'articles.txt';
  fs.writeFileSync(filePath, '');  // Clear or create the file

  for (let i = 0; i < articleLinks.length; i++) {
    const articleUrl = articleLinks[i];
    const articlePage = await browser.newPage();

    try {
      // Open the article in a new tab
      await articlePage.goto(articleUrl, { waitUntil: 'networkidle2' });

      // Extract title
      const title = await articlePage.$eval('h1.c-heading.c-heading_size_1.c-heading_spaced', el => el.innerText);

      // Extract content without the specified divs
      const content = await articlePage.evaluate(() => {
        const contentDiv = document.querySelector('div.c-text.c-article-content.u-vertical-spacing-medium');
        
        // Remove divs with the specified class
        const tweets = contentDiv.querySelectorAll('div.twitter-tweet.twitter-tweet-rendered');
        tweets.forEach(tweet => tweet.remove());

        return contentDiv.innerText; // Get text from the div
      });

      // Save title and content in the text file
      fs.appendFileSync(filePath, `Title ${title}: \n${content}\n\n`);
    } catch (error) {
      console.error(`Failed to extract article ${i + 1}:`, error);
    } finally {
      await articlePage.close(); // Close the tab
    }
  }

  console.log(`Articles saved to ${filePath}`);
  await browser.close();
})();
