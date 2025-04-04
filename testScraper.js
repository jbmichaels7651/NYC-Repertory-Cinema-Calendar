const fetchMetrographShowtimes = require('./metrographScraper');

async function test() {
  const showtimes = await fetchMetrographShowtimes();
  console.log('Metrograph Showtimes:', showtimes);
}

test();

