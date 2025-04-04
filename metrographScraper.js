const puppeteer = require('puppeteer');

async function fetchMetrographShowtimes() {
  console.log("Scraper is running...");

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.goto('https://metrograph.com/calendar/', {
    waitUntil: 'networkidle2',
  });

  // Scroll to bottom to trigger lazy loading
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  await new Promise(resolve => setTimeout(resolve, 5000)); // wait for lazy load

  const showtimes = await page.evaluate(() => {
    const items = [];

    const eventCards = document.querySelectorAll('[data-testid="CalendarItem"]');

    eventCards.forEach(card => {
      const title = card.querySelector('[data-testid="FilmTitle"]')?.textContent?.trim();
      const date = card.querySelector('[data-testid="ShowDate"]')?.textContent?.trim();
      const time = card.querySelector('[data-testid="ShowTime"]')?.textContent?.trim();

      if (title || date || time) {
        items.push({ title, date, time });
      }
    });

    return items;
  });

  console.log("Metrograph Showtimes:", showtimes);
  await browser.close();
  return showtimes;
}

module.exports = fetchMetrographShowtimes;






