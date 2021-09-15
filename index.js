const express = require('express');



const app = express();

const cron = require('node-cron');

const pup = require('puppeteer');

const PORT = process.env.PORT || 4000;

global.dataPlays = [
    [
    "Young Boys\nManchester Utd.",
    "11:45 am\nChampions League - Star+ ESPN"
    ],
    [
    "Sevilla FC\nRed Bull Salzburg",
    "11:45 am\nChampions League - Star+ FOX Sports"
    ],
    [
    "Talleres Córdoba\nPlatense",
    "12:15 pm\nPrimera División Argentina - Fanatiz TyC Sports Internacional"
    ],
    [
    "Dynamo Kyiv\nBenfica",
    "2:00 pm\nChampions League - FOX Sports 3 Star+"
    ],
    [
    "Lille\nVfL Wolfsburg",
    "2:00 pm\nChampions League - Star+ FOX Sports 2"
    ],
    [
    "Villarreal\nAtalanta",
    "2:00 pm\nChampions League - Star+ ESPN 3"
    ],
    [
    "FC Barcelona\nFC Bayern",
    "2:00 pm\nChampions League - Star+ ESPN"
    ],
    [
    "Chelsea\nZenit St. Petersburg",
    "2:00 pm\nChampions League - Star+ FOX Sports"
    ],
    [
    "Malmö FF\nJuventus",
    "2:00 pm\nChampions League - Star+ ESPN 2 Andino"
    ],
    [
    "Arsenal Sarandí\nCA Colón",
    "2:30 pm\nPrimera División Argentina - Fanatiz"
    ],
    [
    "Central Córdoba\nAtlético Tucumán",
    "4:45 pm\nPrimera División Argentina - Fanatiz TyC Sports Internacional"
    ],
    [
    "Boyacá Chicó\nAtlético FC",
    "6:00 pm\nTorneo BetPlay DIMAYOR - Win Sports+"
    ],
    [
    "Toronto FC\nInter Miami CF",
    "6:30 pm\nMLS - Star+"
    ],
    [
    "Boca Juniors\nDefensa y Justicia",
    "7:00 pm\nPrimera División Argentina - ESPN Fanatiz"
    ],
    [
    "Fortaleza\nBogotá",
    "8:00 pm\nTorneo BetPlay DIMAYOR - Win Sports+ Win Sports"
    ],
];


//script para scrapear la web
async function scrape() {
    const browser = await pup.launch();
    const page    = await browser.newPage();
    await page.goto('https://www.lapelotona.com/partidos-de-futbol-para-hoy-en-vivo');
    const data = await page.evaluate(() => {
        const rows =  document.querySelectorAll('table tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        })
    });
    dataPlays = data;

    await browser.close();
}


//transformando la data en array de objetos
let ArrayData = [];
for(i=1;i<dataPlays.length;i++){
    if(dataPlays[i].length == 0){
        break;
    }
    ArrayData.push({equipos:dataPlays[i][0].replace(/\r?\n|\r/g, ' vs '), hora: dataPlays[i][1].replace(/\r?\n|\r/g, ' *** ')})
    
}

// script para ejecutar el evento cada 24 horas
cron.schedule('1 5 00 * * *', () => {
    console.log('cron');
    scrape();
})

//ruta api con información
app.get('/api/v1/schedule', (req, res) => {    
    res.json(ArrayData)
})

app.listen(PORT, () => {
    console.log('server is running in port:', PORT);
});