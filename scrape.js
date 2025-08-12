const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const url = "https://earthquake.phivolcs.dost.gov.ph";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

async function scrapeEarthquakeData() {
  try {
    const { data } = await axios.get(url, { httpsAgent: agent });
    const $ = cheerio.load(data);
    // test for mirroring in gitlab

    const earthquakeData = [];

    // there are three tables in the page, we are only interested in the 2nd table

    // Adjust the selector based on the actual structure of the website
    $("body > div > table:nth-child(4) tbody tr").each((index, element) => {
      if (index >= 1) {
        const date = $(element).find("td").eq(0).text().trim();
        const latitude = $(element).find("td").eq(1).text().trim();
        const longitude = $(element).find("td").eq(2).text().trim();
        const depth = $(element).find("td").eq(3).text().trim();
        const magnitude = $(element).find("td").eq(4).text().trim();
        const location = $(element).find("td").eq(5).text().trim();

        earthquakeData.push({
          date,
          latitude,
          longitude,
          depth,
          magnitude,
          location,
        });
      }
    });

    console.log(earthquakeData);

    // insert your code here to save the data to a database or file

    // save to text file
    const fs = require("fs");
    // rename the file which is the date now
    fs.writeFileSync(
      `earthquake-data-${new Date()}.json`,
      JSON.stringify(earthquakeData, null, 2)
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

scrapeEarthquakeData();
