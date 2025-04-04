import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.SHOWTIMES_API_KEY;
  const today = new Date().toISOString().split('T')[0];

  const baseUrl = 'https://api.internationalshowtimes.com/v4';

  const params = new URLSearchParams({
    lat: '40.7128',
    lon: '-74.0060',
    time_from: `${today}T00:00:00`,
    time_to: `${today}T23:59:59`,
    countries: 'US',
    radius: '15',
    limit: '50',
  });

  const headers = {
    'X-API-Key': apiKey,
  };

  try {
    // Step 1: Get showtimes
    const showRes = await fetch(`${baseUrl}/showtimes?${params.toString()}`, { headers });
    const { showtimes } = await showRes.json();

    // Step 2: Get movie and cinema details
    const movieIds = [...new Set(showtimes.map(s => s.movie_id).filter(Boolean))];
    const cinemaIds = [...new Set(showtimes.map(s => s.cinema_id).filter(Boolean))];

    const [moviesRes, cinemasRes] = await Promise.all([
      fetch(`${baseUrl}/movies?ids=${movieIds.join(',')}`, { headers }),
      fetch(`${baseUrl}/cinemas?ids=${cinemaIds.join(',')}`, { headers }),
    ]);

    const { movies } = await moviesRes.json();
    const { cinemas } = await cinemasRes.json();

    const movieMap = Object.fromEntries(movies.map(m => [m.id, m.title]));
    const cinemaMap = Object.fromEntries(cinemas.map(c => [c.id, c.name]));

    // Step 3: Merge data into showtimes
    const merged = showtimes.map(s => ({
      ...s,
      movie_title: movieMap[s.movie_id] || 'Unknown Movie',
      cinema_name: cinemaMap[s.cinema_id] || 'Unknown Theater',
    }));

    return NextResponse.json({ showtimes: merged });
  } catch (error) {
    console.error('❌ Error merging showtimes:', error);
    return NextResponse.json({ error: 'Failed to load showtimes' }, { status: 500 });
  }
}
