const e = require('express');
const puppeteer = require('puppeteer');

//pagina transferMark cu echipa si sezonul preselectat
const url = 'https://www.transfermarkt.com/mark-noble/leistungsdatendetails/spieler/31835/plus/0?saison=&verein=&liga=&wettbewerb=GB1&pos=&trainer_id=';



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async ()=>{
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage({});

  page.on('load', () => console.log('Page loaded!: ' + page.url()));
  await page.goto(url, {
          waitUntil: ['load','domcontentloaded','networkidle0','networkidle2']
      });

      await sleep(4000);
      await page.waitForXPath('//*[@id="yw1"]/table/tfoot/tr/td[8]');

      // evaluate XPath expression of the target selector (it return array of ElementHandle)
      let elHandle = await page.$x('//*[@id="yw1"]/table/tfoot/tr/td[8]');
  
      // prepare to get the textContent of the selector above (use page.evaluate)
      let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]);
  
      console.log('Total Property Number is:', lamudiNewPropertyCount);
        
})();


