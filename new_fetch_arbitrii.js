const puppeteer = require('puppeteer');
//TRANSFER MARK - CEL NOU
//link cu sezon preselectat
const url = 'https://www.transfermarkt.com/premier-league/schiedsrichter/wettbewerb/GB1/plus/?saison_id=2020&fbclid=IwAR3HllC9J8mfdmzQippu-FOz4ePDIEAadxcEzrzAHBodNokSxQaUXG-AWKM';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let obiect_global = {};


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

    //let tabel = await page.$x('//*[@id="yw1"]/table/tbody');
    const featureArticle = (await page.$x('//*[@id="yw1"]/table/tbody'))[0];

    const text = await page.evaluate(el => {
        let trs = Array.from(el.querySelectorAll('tr'));

        let final_here  = [];

        trs.forEach((tr)=>{
            let tds = Array.from(tr.querySelectorAll('td'));

            let tds_data = tds.map(td_data => td_data.innerText);


            final_here.push(tds_data);
            console.log(tds_data)
        })        



        //let test_2 = trs.map(data => data.innerText);

        return final_here;
    }, featureArticle);

    console.log(text);
    let temp_arbitrii = prelucrareArbitrii_1(text);
    let final_final = prelucrareArbitrii_2(temp_arbitrii);
    console.log(final_final);

})();

const prelucrareArbitrii_1 = (arr)=>{
    let maxim = arr.length;
    let contor_switch = 0;

    let temp_obj_mare = {};
    let temp_obj_mic = [];

    console.log("Start");

    arr.forEach((el, index)=>{
        if(contor_switch == 3)
        {
            console.log("-----------")
            contor_switch = 0;
            temp_obj_mare[temp_obj_mic[0][2]] = [...temp_obj_mic]
            temp_obj_mic = [];

        }
        console.log(el);
        temp_obj_mic.push(el); 
        contor_switch =contor_switch+1;

        
    })

    console.log(temp_obj_mare);
    return temp_obj_mare;

}

const prelucrareArbitrii_2 = (obj)=>{
    let final_obj = {};
    for(let c in obj)
    {
        let name = obj[c][0][2];
        let matches = obj[c][0][5];
        let galben_1 = obj[c][0][6];
        let galben_2 = obj[c][0][7];

        let galben_1_final = 0;
        if('-' != galben_1.trim())
        {
            //nu este '-'
            galben_1_final = Number(galben_1)
        }
        let galben_2_final = 0;
        if('-' != galben_2.trim())
        {
            //nu este '-'
            galben_2_final = Number(galben_2)
        }
        let total_galben_nr = galben_1_final + galben_2_final;

        final_obj[name] = {
            'meciuri': Number(matches),
            'galbenuri': total_galben_nr
        }
        
    }
    return final_obj
}