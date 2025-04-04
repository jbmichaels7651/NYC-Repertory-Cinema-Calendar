const puppeteer = require('puppeteer');

async function fetchFilmForumShowtimes() {
  console.log("Scraper is running...");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://filmforum.org/now_playing', { waitUntil: 'networkidle2' });

  // Wait for full page load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Take a screenshot for visual confirmation
  await page.screenshot({ path: 'filmforum-screenshot.png', fullPage: true });

  const films = await page.evaluate(() => {
    const results = [];
    const filmElements = document.querySelectorAll('div.program');

    filmElements.forEach(el => {
      const title = el.querySelector('.info h3')?.innerText.trim();

      const showtimeEls = el.querySelectorAll('ul.showtimes li');
      const showtimes = Array.from(showtimeEls)
        .map(st => st.innerText.trim())
        .filter(Boolean)
        .join(', ');

      if (title && showtimes) {
        results.push({ title, showtimes });
      }
    });

    return results;
  });

  console.log("Film Forum Showtimes:", films);
  await browser.close();
}

fetchFilmForumShowtimes();

