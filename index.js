const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.PORT || 8080;

const CronJob = require("cron").CronJob;

global.arrayData = [];

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

  app.get("/api/v1/schedule", (req, res) => {
    res.json(arrayData);
  });

  app.listen(PORT, () => {
    console.log("server is running in port:", PORT);
  });

  let job = new CronJob(
    "27 10 * * *",
    () => {
      console.log("cron task working!");
      rawArray();
    },
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();
};

main();
