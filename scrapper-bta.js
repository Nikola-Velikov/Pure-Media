const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toLocaleDateString('bg-BG').replace(/\//g, '.').replace(' г.', '');

  const totalPages = 100;
  const outputFile = path.join(__dirname, 'all_news.txt');

  fs.writeFileSync(outputFile, '');

  const seenArticles = new Set();

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const url = `https://www.bta.bg/bg/news?term=&from=${formattedDate}&to=${formattedDate}&p=${pageNumber}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const newsLinks = await page.$$('.col-sm-6.col-md-4.col-lg-3 a');
    
    for (let articleIndex = 0; articleIndex < newsLinks.length; articleIndex++) {
      try {
        const newsLinks = await page.$$('.col-sm-6.col-md-4.col-lg-3 a');
        
        const articleUrl = await page.evaluate(el => el.href, newsLinks[articleIndex]);
        const articlePage = await browser.newPage();
        await articlePage.goto(articleUrl, { waitUntil: 'networkidle2' });

        let title = await articlePage.$eval('h1.post__title', el => el.innerText.trim());
        title = title.replace('site.bta', '').trim();

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

        const articleIdentifier = `${title}-${content}`;
        if (!seenArticles.has(articleIdentifier)) {
          const articleText = `Title ${title}: \n${content}\n\n`;
          fs.appendFileSync(outputFile, articleText, 'utf-8');
          console.log(`Appended article from page ${pageNumber}, item ${articleIndex + 1}`);
          
          seenArticles.add(articleIdentifier);
        } else {
          console.log(`Skipped duplicate article from page ${pageNumber}, item ${articleIndex + 1}`);
        }

        await articlePage.close();

      } catch (error) {
        console.error(`Error processing item ${articleIndex + 1} on page ${pageNumber}: ${error}`);
      }
    }
  }

  await browser.close();
  console.log(`All articles saved to ${outputFile}`);
})();
