import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.SHOWTIMES_API_KEY;
  const today = new Date();
  const fromDate = today.toISOString().split('T')[0];
  const toDate = new Date(today);
  toDate.setDate(toDate.getDate() + 5);
  const toDateStr = toDate.toISOString().split('T')[0];

  const baseUrl = 'https://api.internationalshowtimes.com/v4';
  const headers = { 'X-API-Key': apiKey };

  const cinemaIds = [
    '41515', // Film Forum
    '41517', // IFC Center
    '65959', // Museum of the Moving Image
    '65751', // Metrograph
    '65747', // Roxy Cinema
    '41518', // Anthology Film Archives
  ];

  try {
    const showRes = await fetch(
      `${baseUrl}/showtimes?cinema_id=${cinemaIds.join(',')}&time_from=${fromDate}T00:00:00&time_to=${toDateStr}T23:59:59&limit=100`,
      { headers }
    );

    const showData = await showRes.json();
    console.log('✅ Showtimes response:', showData);

    const showtimes = showData.showtimes || [];
    const validShowtimes = showtimes.filter(s => s.movie_id && s.cinema_id);

    const movieIds = [...new Set(validShowtimes.map(s => s.movie_id))].slice(0, 50);
    const uniqueCinemaIds = [...new Set(validShowtimes.map(s => s.cinema_id))];

    const [moviesRes, cinemasRes] = await Promise.all([
      fetch(`${baseUrl}/movies?ids=${movieIds.join(',')}`, { headers }),
      fetch(`${baseUrl}/cinemas?ids=${uniqueCinemaIds.join(',')}`, { headers }),
    ]);

    const moviesData = await moviesRes.json();
    const cinemasData = await cinemasRes.json();

    console.log('✅ Movies:', moviesData);
    console.log('✅ Cinemas:', cinemasData);

    const movieMap = Object.fromEntries((moviesData.movies || []).map(m => [m.id, m.title]));
    const cinemaMap = Object.fromEntries((cinemasData.cinemas || []).map(c => [c.id, c.name]));

    const merged = validShowtimes.map(s => ({
      ...s,
      movie_title: movieMap[s.movie_id] || 'Unknown Movie',
      cinema_name: cinemaMap[s.cinema_id] || 'Unknown Theater',
    }));

    return NextResponse.json({ showtimes: merged });
  } catch (error) {
    console.error('❌ Error during showtime fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch showtimes' }, { status: 500 });
  }
}
