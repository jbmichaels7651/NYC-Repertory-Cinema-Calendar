'use client';

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const currentYear = new Date().getFullYear();
const excludedYears = [currentYear, currentYear - 1];

const events = [
  {
    title: "Tokyo Story (1953) @ Metrograph",
    date: "2025-03-29",
    theater: "Metrograph",
    year: 1953
  },
  {
    title: "Blue Velvet (1986) @ IFC Center",
    date: "2025-03-29",
    theater: "IFC Center",
    year: 1986
  },
  {
    title: "Persona (1966) @ Film Forum",
    date: "2025-03-30",
    theater: "Film Forum",
    year: 1966
  },
  {
    title: "Aguirre (1972) @ Roxy Cinema",
    date: "2025-03-30",
    theater: "Roxy Cinema",
    year: 1972
  },
  {
    title: "Battleship Potemkin (1925) @ Museum of the Moving Image",
    date: "2025-03-30",
    theater: "Museum of the Moving Image",
    year: 1925
  },
  {
    title: "Barbenheimer (2025) @ Nitehawk",
    date: "2025-03-30",
    theater: "Nitehawk",
    year: 2025
  }
];

export default function Home() {
  const [selectedTheater, setSelectedTheater] = useState("All");

  const filteredEvents =
    selectedTheater === "All"
      ? events.filter(e => !excludedYears.includes(e.year))
      : events.filter(
          e => e.theater === selectedTheater && !excludedYears.includes(e.year)
        );

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1rem" }}>
        NYC Repertory Cinema Calendar
      </h1>
      <label htmlFor="theater">Filter by Theater:</label>
      <select
        id="theater"
        onChange={e => setSelectedTheater(e.target.value)}
        value={selectedTheater}
        style={{ margin: "0 0 1rem 1rem", padding: "0.5rem" }}
      >
        <option value="All">All</option>
        <option value="Metrograph">Metrograph</option>
        <option value="IFC Center">IFC Center</option>
        <option value="Film Forum">Film Forum</option>
        <option value="Roxy Cinema">Roxy Cinema</option>
        <option value="Museum of the Moving Image">Museum of the Moving Image</option>
        <option value="Nitehawk">Nitehawk</option>
      </select>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        height="auto"
      />
    </div>
  );
}
