const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to get the previous day's date in the format YYYY-MM-DD
function getPreviousDay() {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.mediapool.bg/today.html', { waitUntil: 'networkidle2' });

  const previousDay = getPreviousDay();
  await page.evaluate((date) => {
    document.querySelector('#rdate').value = date;
  }, previousDay);

  // Wait for the submit button to be visible and then click it
  await page.waitForSelector('button.c-button.c-button_primary.c-button_wide[type="submit"]', { visible: true });

  await page.evaluate(() => {
    document.querySelector('button.c-button.c-button_primary.c-button_wide[type="submit"]').click();
  });

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const articleLinks = await page.$$eval(
    '.l-grid__cell.l-grid__cell_size_50.l-grid__cell_size-tiny_100 a',
    links => links.map(link => link.href)
  );

  const filePath = 'articles.txt';
  fs.writeFileSync(filePath, '');

  for (let i = 0; i < articleLinks.length; i++) {
    const articleUrl = articleLinks[i];
    const articlePage = await browser.newPage();

    try {
      await articlePage.goto(articleUrl, { waitUntil: 'networkidle2' });

      const title = await articlePage.$eval('h1.c-heading.c-heading_size_1.c-heading_spaced', el => el.innerText);

      const content = await articlePage.evaluate(() => {
        const contentDiv = document.querySelector('div.c-text.c-article-content.u-vertical-spacing-medium');
        
        const tweets = contentDiv.querySelectorAll('div.twitter-tweet.twitter-tweet-rendered');
        tweets.forEach(tweet => tweet.remove());

        return contentDiv.innerText;
      });

      fs.appendFileSync(filePath, `Title ${title}: \n${content}\n\n`);
    } catch (error) {
      console.error(`Failed to extract article ${i + 1}:`, error);
    } finally {
      await articlePage.close();
    }
  }

  console.log(`Articles saved to ${filePath}`);
  await browser.close();
})();
