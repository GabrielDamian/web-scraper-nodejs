const e = require('express');
const puppeteer = require('puppeteer');

//pagina transferMark cu echipa si sezonul preselectat
//const url = 'https://www.transfermarkt.com/west-ham-united/kader/verein/379?fbclid=IwAR3svNwGhwCGuw9sZvUbIUKeu8FndCoV9RTxuefaxlN7kjE9xQvh7j1TNQs';
const url = 'https://www.transfermarkt.com/manchester-city/startseite/verein/281?fbclid=IwAR3svNwGhwCGuw9sZvUbIUKeu8FndCoV9RTxuefaxlN7kjE9xQvh7j1TNQs';

let obiect_global = {};

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

        let table = await page.evaluate(()=>{
            
            let final_obj = {};
            const trs = Array.from(document.querySelectorAll('.spielprofil_tooltip.tooltipstered'))


            let links = trs.map((el)=>{
                return el.getAttribute('href');
            })
            return links;
        })

        
        let  remove_duplicated= [...new Set(table)];

        remove_duplicated.forEach(async (link_player)=>{
            sleep(1000);
            const link_destructurat = link_player.split('/');
            //console.log(link_destructurat);
            const link_player_final = `https://www.transfermarkt.com/${link_destructurat[1]}/leistungsdatendetails/spieler/${link_destructurat[4]}/plus/0?saison=&verein=&liga=&wettbewerb=GB1&pos=&trainer_id=`
            //console.log(link_player_final)

            //apel functie separata
            await functieSeparataPromise(link_player_final, link_destructurat[1])
        })


console.log("FINALLL______________",obiect_global);

})();



let functie_separata = async (url_param,player_name)=>{
    const browser = await puppeteer.launch({
      headless: true,
    });
  
    const page = await browser.newPage({});
  
    //page.on('load', () => console.log('Page loaded!: ' + page.url()));

    await page.goto(url_param, {
            waitUntil: ['load','domcontentloaded','networkidle0','networkidle2']
        });
  
        await page.waitForXPath('//*[@id="yw1"]/table/tfoot/tr/td[8]');
  
        // evaluate XPath expression of the target selector (it return array of ElementHandle)
        let elHandle = await page.$x('//*[@id="yw1"]/table/tfoot/tr/td[8]');
    
        // prepare to get the textContent of the selector above (use page.evaluate)
        let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]);
    
        
        //obiect_global[player_name] = lamudiNewPropertyCount;
        console.log(player_name + " = " + lamudiNewPropertyCount);
        await browser.close();
}

const functieSeparataPromise = async (url_param,player_name)=>
{
  return new Promise (async (resolve, reject)=>{
    const browser = await puppeteer.launch({
      headless: true,
    });
  
    const page = await browser.newPage({});
  
    //page.on('load', () => console.log('Page loaded!: ' + page.url()));

    await page.goto(url_param, {
            waitUntil: ['load','domcontentloaded','networkidle0','networkidle2']
        });
  
        await page.waitForXPath('//*[@id="yw1"]/table/tfoot/tr/td[8]');
  
        // evaluate XPath expression of the target selector (it return array of ElementHandle)
        let elHandle = await page.$x('//*[@id="yw1"]/table/tfoot/tr/td[8]');
    
        // prepare to get the textContent of the selector above (use page.evaluate)
        let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]);
    
        
        //obiect_global[player_name] = lamudiNewPropertyCount;
        console.log(player_name + " = " + lamudiNewPropertyCount);
        await browser.close();
        resolve("done");


  })
  

}