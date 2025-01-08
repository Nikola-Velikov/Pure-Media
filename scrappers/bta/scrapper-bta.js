const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Define the date for the previous day in dd.mm.yyyy format without the "г." suffix
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toLocaleDateString('bg-BG').replace(/\//g, '.').replace(' г.', '');

  const totalPages = 47;
  const outputFile = path.join(__dirname, 'all_news.txt');

  // Clear the output file at the start
  fs.writeFileSync(outputFile, ''); 

  const seenArticles = new Set();

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const url = `https://www.bta.bg/bg/news?term=&from=${formattedDate}&to=${formattedDate}&p=${pageNumber}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get all news links once per page
    const newsLinks = await page.$$('.col-sm-6.col-md-4.col-lg-3 a');
    
    for (let articleIndex = 0; articleIndex < newsLinks.length; articleIndex++) {
      try {
        // Reload news links in case of dynamic updates
        const newsLinks = await page.$$('.col-sm-6.col-md-4.col-lg-3 a');
        
        // Open each article link in a new tab to avoid back-navigation issues
        const articleUrl = await page.evaluate(el => el.href, newsLinks[articleIndex]);
        const articlePage = await browser.newPage();
        await articlePage.goto(articleUrl, { waitUntil: 'networkidle2' });

        // Extract title and article content, removing "site.bta" from the title
        let title = await articlePage.$eval('h1.post__title', el => el.innerText.trim());
        title = title.replace('site.bta', '').trim();
        const imageUrl = await articlePage.$eval('.u-image-blur img', img => img.src).catch(() => '');
        const url = imageUrl.split('https://www.bta.bg/upload/')[1]
        let content = await articlePage.evaluate(() => {
          const paragraphs = Array.from(document.querySelectorAll('p'));
          return paragraphs.map(p => p.innerText).join('\n').trim();
        });

        // Replace specific unwanted text in content
        content = content
          .replace('news.modal.text', '')
          .replace('02 9262 210', '')
          .replace('© 2022. Всички права са запазени.', '')
          .replace('© Информационно обслужване АД', '')
          .replace(
            'Тази интернет страница използва бисквитки (cookies). Като приемете бисквитките, можете да се възползвате от оптималното поведение на интернет страницата.',
            ''
          ).trim();

        // Generate a unique identifier for each article using title and content
        const articleIdentifier = `${title}-${content}`;
        if (!seenArticles.has(articleIdentifier)) {
          // Append the title and content to the output file
          const articleText = `Title ${title};;;${url}: \n${content}\n\n`;
          fs.appendFileSync(outputFile, articleText, 'utf-8');
          console.log(`Appended article from page ${pageNumber}, item ${articleIndex + 1}`);
          
          // Add identifier to the Set
          seenArticles.add(articleIdentifier);
        } else {
          console.log(`Skipped duplicate article from page ${pageNumber}, item ${articleIndex + 1}`);
        }

        await articlePage.close(); // Close the article tab

      } catch (error) {
        console.error(`Error processing item ${articleIndex + 1} on page ${pageNumber}: ${error}`);
      }
    }
  }

  await browser.close();
  console.log(`All articles saved to ${outputFile}`);
})();
