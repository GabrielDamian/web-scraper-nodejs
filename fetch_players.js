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

        // remove_duplicated.forEach(async (link_player)=>{
        //     sleep(1000);
        //     const link_destructurat = link_player.split('/');
        //     //console.log(link_destructurat);
        //     const link_player_final = `https://www.transfermarkt.com/${link_destructurat[1]}/leistungsdatendetails/spieler/${link_destructurat[4]}/plus/0?saison=&verein=&liga=&wettbewerb=GB1&pos=&trainer_id=`
        //     //console.log(link_player_final)

        //     //apel functie separata
        //     await functieSeparataPromise(link_player_final, link_destructurat[1])
        // })

        //remove null-s
        let remove_nulls =[];
         remove_duplicated.forEach(element => {
           if(element != null)
           {
             remove_nulls.push(element);
           }
         });
        
        console.log("remove nulls")
        console.log(remove_nulls.length);
        for(let i=0;i<remove_nulls.length;i++)
        {
          let link_destructurat = remove_nulls[i].split('/');
          const link_player_final = `https://www.transfermarkt.com/${link_destructurat[1]}/leistungsdatendetails/spieler/${link_destructurat[4]}/plus/0?saison=&verein=&liga=&wettbewerb=GB1&pos=&trainer_id=`
          let temp_resp =await functieSeparataPromise(link_player_final, link_destructurat[1]);

        }

    console.log("FINALLL______________",obiect_global);
    let temp_obj_1 = intocmesteRaport(obiect_global);
    raportEchipa(temp_obj_1);
    
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
  
        //await page.waitForXPath('//*[@id="yw1"]/table/tfoot/tr/td[8]');
  
        // evaluate XPath expression of the target selector (it return array of ElementHandle)
        let cards_player = await page.$x('//*[@id="yw1"]/table/tfoot/tr/td[8]');
        let matches_player = await page.$x('//*[@id="yw1"]/table/tfoot/tr/td[5]');

        // prepare to get the textContent of the selector above (use page.evaluate)
        let data_cards = await page.evaluate(el => el.textContent, cards_player[0]).catch((err)=>{
          console.log("treci peste cards;")
        })
        
        let data_matches = await page.evaluate(el=>el.textContent, matches_player[0]).catch((err)=>{
          console.log("treci peste matches")
        })
        
        //obiect_global[player_name] = lamudiNewPropertyCount;
        console.log(player_name + " = " + data_cards + " - meciuri[" + data_matches +"]");

        if(data_cards != undefined && data_matches != undefined)
        {
          let temp_structure = data_cards.split('/');
          if(temp_structure.length >1)
          {
            obiect_global[player_name] ={
              meciuri_jucate: data_matches,
              primul_galben: temp_structure[0],
              al_doilea_galben: temp_structure[1],
              rosu: temp_structure[2]
  
            }
          }

        }

 
        await browser.close();
        resolve("done");


  })
  

}

const  intocmesteRaport =(obj)=>{
  let obiect_finisat = {};

    for(let c in obj)
    {
      let temp = {};

      let primul_galben;
      let trim_primul_galben = (obj[c]['primul_galben']).trim();
      if( trim_primul_galben != '-')
      {
        console.log("=>")
        console.log(obj[c]['primul_galben'])
        console.log(Number(obj[c]['primul_galben']))

        primul_galben = Number(obj[c]['primul_galben'])
      }
      else
      {
        console.log("zero")
        primul_galben = 0;
      }

      let al_doilea_galben;
      let trim_al_doilea_galben = (obj[c]['al_doilea_galben']).trim();

      if(trim_al_doilea_galben != '-')
      {
        console.log(obj[c]['al_doilea_galben'])
        console.log(Number(obj[c]['al_doilea_galben']))
        al_doilea_galben = Number(obj[c]['al_doilea_galben'])
      }
      else
      {
        console.log("zero")
        al_doilea_galben = 0;
      }


      let galbernuri = primul_galben + al_doilea_galben;
      let ratie;
      if(galbernuri > 0)
      {
        ratie = galbernuri / obj[c]['meciuri_jucate'];
      }
      else
      {
        ratie = 0;
      }

      temp['ratie_galben'] = ratie.toFixed(3);
      temp['galbenuri'] = galbernuri;
      temp['meciuri'] = obj[c]['meciuri_jucate']
      obiect_finisat[c] = { ...temp}
    }
    console.log(obiect_finisat);
    return obiect_finisat;
}

const raportEchipa = (obj)=>{
  let split_temp = url.split('/');
  let nume = split_temp[3];

  let suma_galben = 0.0;
  for(let c in obj)
  {
    suma_galben = suma_galben + Number(obj[c]['ratie_galben']);
  }

  console.log("-----------RAPORT-----------")
  console.log("Echipa: "+ nume);
  console.log("Medie galben: ", suma_galben)
}