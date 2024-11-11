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

    const earthquakeData = [];

    // Adjust the selector based on the actual structure of the website
    $("table tbody tr").each((index, element) => {
      if (index >= 3) {
        const date = $(element).find("td").eq(0).text().trim();
        const latitude = $(element).find("td").eq(1).text().trim();
        const longitude = $(element).find("td").eq(2).text().trim();
        const depth = $(element).find("td").eq(3).text().trim();
        const magnitude = $(element).find("td").eq(4).text().trim();
        const location = $(element).find("td").eq(5).text().trim();

        earthquakeData.push({ date, latitude, longitude, depth, magnitude, location });
      }
    });

    console.log(earthquakeData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

scrapeEarthquakeData();
