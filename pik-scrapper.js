const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = 'https://pik.bg/yesterday.html?page=';
const outputFile = 'news_content.txt';
const totalPages = 7;
const visitedLinks = new Set(); // To track unique news links

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  fs.writeFileSync(outputFile, '');

  for (let i = 1; i <= totalPages; i++) {
    await page.goto(`${baseUrl}${i}`, { waitUntil: 'networkidle2', timeout: 160000 });
    console.log(`Scraping page ${i}...`);

    const newsLinks = await page.$$eval('.news-box-small.left a', anchors => anchors.map(a => a.href));

    for (const link of newsLinks) {
      if (visitedLinks.has(link)) continue;
      visitedLinks.add(link);

      const newTab = await browser.newPage();
      await newTab.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

      // Scrape the title
      const title = await newTab.$eval(
        'h2',
        el => el.innerText.trim()
      );

      const paragraphs = await newTab.$$eval('p:not([style])', elements =>
        elements.map(el => el.innerText.trim())
      );

      const content = `Title ${title}: \n${paragraphs.join('')}\n\n`;

      fs.appendFileSync(outputFile, content);
      console.log(`Saved article: ${title}`);

      await newTab.close();
    }
  }

  await browser.close();
  console.log('Scraping completed.');
})();