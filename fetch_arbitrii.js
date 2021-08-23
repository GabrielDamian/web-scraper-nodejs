const puppeteer = require('puppeteer');

//se pre-selecteaza sezonul (19-20, 20-21), inainte de a pasa link-ul
const url = 'https://www.premierleague.com/referees/index?fbclid=IwAR1jq_omAM7Spq0Zsp-pIxtT1nicigFiZoQ7v1a6RlEu1HploKxcNIHlxi4';

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

    const cookieAcceptBtn = await page.$(".cookies-notice-accept");

    await console.log('The element cookieAcceptBtn was resolved to: ' + cookieAcceptBtn);
    await cookieAcceptBtn.click();   

    const td_Selector = await page.$(".managerName");

    // let ceva = await page.evaluate((sel)=>{
    //   let elements = Array.from(document.querySelectorAll('.managerName'));
    //   let links = elements.map(el=> el.innerHTML)
    //   return links;
    // })
    // console.log(ceva);

    let table = await page.evaluate(()=>{
      let tableSel = document.querySelector('.dataContainer');
      let array_rows = Array.from(tableSel.querySelectorAll('tr'))

      //let array_dudes = array_rows.map(el=>el.innerHTML)
      let array_dudes = array_rows.map((el)=>{
        return Array.from(el.querySelectorAll('td'))
      })
      let final_obj = {};

      // let test = array_dudes.map((el)=>{
      //   return el[0].innerText;
      // })

      array_dudes.forEach((el)=>{
        let nume = el[0].innerText; 
        let meciuri = el[1].innerText;
        let rosu = el[2].innerText;
        let galben = el[3].innerText;

        let temp_obj = {
          'meciuri': meciuri,
          'rosu': rosu,
          'galben': galben
        }

        final_obj[nume] = {
          ...temp_obj
        };

      })
      return final_obj;

    })
    console.log(table);

    
  
  
})();
