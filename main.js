const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

const CronJob = require("cron").CronJob;

global.arrayData = [
  "FC Kairat AC Omonoia 9:30 am Europa Conference League - Star+   ESPN Play",
  "Real Betis Celtic FC 11:45 am Europa League - Star+",
  "Lokomotiv Moskva O. Marseille 11:45 am Europa League - Star+     ESPN 3",
  "FC Midtjylland PFC Ludogorets 11:45 am Europa League - Star+",
  "Galatasaray Lazio 11:45 am Europa League - Star+",
  "Rennes Tottenham 11:45 am Europa Conference League - Star+     ESPN Play",
  "Rapid Wien Genk 11:45 am Europa League - Star+",
  "Bayer Leverkusen Ferencvaros 11:45 am Europa League - Star+     ESPN 2 Andino",
  "Crvena Zvezda SC Braga 11:45 am Europa League - Star+",
  "GNK Dinamo Zagreb West Ham 11:45 am Europa League - Star+",
  "PSV Eindhoven Real Sociedad 2:00 pm Europa League - Star+",
  "AS Monaco Sturm Graz 2:00 pm Europa League - Star+     ESPN 3",
  "Eintracht Frankfurt Fenerbahçe 2:00 pm Europa League - Star+",
  "Olympiacos Antwerp 2:00 pm Europa League - Star+",
  "Leicester City Napoli 2:00 pm Europa League - Star+     ESPN 2 Andino",
  "AS Roma CSKA Sofia 2:00 pm Europa Conference League - Star+     ESPN Play",
  "Brondby IFSparta Praha 2:00 pm Europa League - Star+",
  "Rangers FCO. Lyonnais 2:00 pm Europa League - Star+",
  "Caracas FCLala FC 3:00 pm Liga Futve - Gol TV Play",
  "Monagas SCUCV 5:15 pm Liga Futve - Gol TV Play",
  "Deportes Tolima La Equidad 5:30 pm Copa Bet Play DIMAYOR - Win Sports+",
  "Deportivo Táchira Zulia 7:30 pm Liga Futve - Gol TV Play",
  "Pereira Deportivo Pasto 8:00 pm Copa Bet Play DIMAYOR - Win Sports+"
  ];

const getDataRaw = (url) => {
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};

const url = "https://www.lapelotona.com/partidos-de-futbol-para-hoy-en-vivo/";

const main = () => {
  const rawArray = async () => {
    try {

      arrayData = [];
      const dataRaw = await getDataRaw(url);
      const $ = cheerio.load(dataRaw);

      $("#partidos-hoy > tbody > tr ")
        .toArray()
        .map((item) => {
          arrayData.push(
            $(item)
              .text()
              .replace("?<=[a-z])(?=[A-Z0-9]")
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .trim()
          );
        });

      arrayData.map((item) => {
        item.replace(/\n/g, "").replace(/\t/g, "");
      });
      console.log("Api loaded !!!");
    } catch (err) {
      console.log(err);
    }
  };

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/statusPage.html");
  });

  app.get("/api/v1/schedule", (req, res) => {
    res.json(arrayData);
  });

  app.listen(PORT, () => {
    console.log("server is running in port:", PORT);
  });

  let job = new CronJob(
    "49 10 * * *",
    () => {
      console.log("cron task working!");
      rawArray();
    },
    null,
    true,
    "America/Bogota"
  );
  job.start();
};

main();
