const puppeteer = require("puppeteer");
const fs = require("fs");
const pageLink = "https://stockx.com/fr-fr/air-jordan-4-retro-lightning-2021";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const userAgent = // bypass antibot
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);

  await page.goto(pageLink); // lien sneakers
  await page.click("#menu-button-pdp-size-selector"); // active la data pour les tailles

  const sizePrice = await page.evaluate(() => {
    let sneaker = [];
    const elements = document.querySelectorAll(".chakra-stat"); // selecteur css taille/prix
    for (element of elements) {
      sneaker.push({
        size: element.querySelector("dt").innerText, // scrape la taille
        price: element.querySelector("dd").innerText, // scrape le prix
      });
    }
    return sneaker;
  });
  console.log(sizePrice);
  fs.writeFile("./sizePrice.json", JSON.stringify(sizePrice), (err) =>
    err ? console.log(err) : null
  ); // retourne un fichier json
  await browser.close(); // On referme automatiquement le browser après avoir scrape
})();
