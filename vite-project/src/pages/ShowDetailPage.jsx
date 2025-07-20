import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Maps genre IDs to titles
const genreMap = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

// Truncate text helper
function truncate(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function ShowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSeason, setExpandedSeason] = useState(null);

  useEffect(() => {
    async function fetchShow() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${id}`
        );
        if (!response.ok) {
          throw new Error("Show not found");
        }
        const data = await response.json();
        setShow(data);
      } catch (err) {
        setError(err.message || "Failed to load show details");
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [id]);

  if (loading) {
    return <p className="p-4 text-center">Loading show details...</p>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="p-4 text-center">
        <p>Show not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const lastUpdated = show.updated
    ? format(new Date(show.updated), "PPP")
    : "Unknown";

  const toggleSeason = (seasonId) => {
    setExpandedSeason((prev) => (prev === seasonId ? null : seasonId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      <div
        onClick={() => navigate(`/another-route/${show.id}`)} // Customize this route
        className="cursor-pointer hover:bg-gray-50 p-2 rounded transition duration-200"
      >
        <h1 className="text-4xl font-bold mb-4 hover:underline">
          {show.title}
        </h1>
        <img
          src={show.image}
          alt={show.title}
          className="w-full max-h-96 object-cover rounded-lg mb-4 hover:opacity-90 transition duration-200"
        />
      </div>

      {/* 📝 Description & Metadata (not clickable) */}
      <p className="mb-4 text-gray-700">{show.description}</p>

      <div className="mb-4">
        {show.genres && show.genres.length > 0 ? (
          show.genres.map((genreId, idx) => (
            <span
              key={`${genreId}-${idx}`}
              className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2"
            >
              {genreMap[genreId] || "Unknown"}
            </span>
          ))
        ) : (
          <span>No genres available</span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">Last updated: {lastUpdated}</p>

      {/* 🎧 Seasons */}
      <div>
        {show.seasons && show.seasons.length > 0 ? (
          show.seasons.map((season) => (
            <div
              key={season.id}
              className="border rounded mb-4 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSeason(season.id)}
                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                aria-expanded={expandedSeason === season.id}
              >
                <span className="font-semibold">
                  {season.title} ({season.episodes.length} episodes)
                </span>
                <span>{expandedSeason === season.id ? "−" : "+"}</span>
              </button>

              {expandedSeason === season.id && (
                <ul className="divide-y">
                  {season.episodes.map((episode, idx) => (
                    <li
                      key={`season-${season.id}-episode-${idx}`}
                      className="flex gap-4 p-4 items-center"
                      aria-label={`Episode ${idx + 1}: ${episode.title}`}
                    >
                      <img
                        src={season.image}
                        alt={`Season ${season.title} image`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {idx + 1}. {episode.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {truncate(episode.description, 100)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p>No seasons available.</p>
        )}
      </div>
    </div>
  );
}

export default ShowDetailPage;
