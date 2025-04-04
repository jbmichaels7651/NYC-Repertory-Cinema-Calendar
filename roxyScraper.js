const puppeteer = require('puppeteer');

async function fetchRoxyShowtimes() {
  console.log("Scraper is running...");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.roxycinematribeca.com/now-showing/', {
    waitUntil: 'networkidle2',
  });

  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.screenshot({ path: 'roxy-screenshot.png', fullPage: true });

  const showtimes = await page.evaluate(() => {
    const results = [];
    const blocks = document.querySelectorAll('.et_pb_module.et_pb_text');

    let currentDate = '';

    blocks.forEach(block => {
      const text = block.innerText.trim();
      console.log('BLOCK:\n', text); // ✅ LOG THE FULL TEXT

      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

      if (/^[A-Z][a-z]+ \d{1,2}/.test(lines[0])) {
        currentDate = lines[0];
        return;
      }

      const timeLine = lines.find(line => /\d{1,2}:\d{2} ?[APap][Mm]/.test(line));
      const titleLine = lines.find(line =>
        /^[A-Z][a-z]/.test(line) && !line.includes(':') && !line.match(/\d{1,2}:\d{2}/)
      );

      if (currentDate && timeLine && titleLine) {
        results.push({
          title: titleLine,
          date: currentDate,
          times: timeLine,
        });
      }
    });

    return results;
  });

  console.log("\nRoxy Showtimes:", showtimes);
  await browser.close();
}

fetchRoxyShowtimes();
