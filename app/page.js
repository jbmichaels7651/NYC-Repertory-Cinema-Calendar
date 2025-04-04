'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [showtimes, setShowtimes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadShowtimes() {
      try {
        const res = await fetch('/api/showtimes');
        if (!res.ok) throw new Error('Failed to fetch showtimes');
        const data = await res.json();
        setShowtimes(data.showtimes || []);
      } catch (err) {
        console.error(err);
        setError('Could not load showtimes.');
      }
    }

    loadShowtimes();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">NYC Showtimes</h1>

      {error && <p className="text-red-500">{error}</p>}

      {showtimes.length === 0 && !error ? (
        <p>Loading showtimes...</p>
      ) : (
        <ul className="space-y-4">
          {showtimes.map((show, index) => (
            <li key={index} className="p-4 border rounded-xl shadow">
              <p className="font-semibold">
                {new Date(show.start_at).toLocaleString()}
              </p>
              <p>Theater ID: {show.cinema_id}</p>
              {show.booking_link && (
                <a
                  href={show.booking_link}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Book now
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
