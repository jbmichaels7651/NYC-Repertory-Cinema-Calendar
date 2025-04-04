import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.SHOWTIMES_API_KEY;
  const today = new Date().toISOString().split('T')[0];

  const url = 'https://api.internationalshowtimes.com/v4/showtimes';

  const params = new URLSearchParams({
    lat: '40.7128',
    lon: '-74.0060',
    time_from: `${today}T00:00:00`,
    time_to: `${today}T23:59:59`,
    countries: 'US',
    radius: '15',
    limit: '50',
    expand: 'movie,cinema',
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching showtimes:', error);
    return NextResponse.json({ error: 'Failed to fetch showtimes' }, { status: 500 });
  }
}