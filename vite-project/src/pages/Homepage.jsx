import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Genre ID to title map
 */
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

/**
 * HomePage component to list podcast previews with search and filter.
 * @returns {JSX.Element}
 */
const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const genre = params.get("genre") || "";
    setSearchTerm(search);
    setSelectedGenre(genre);
  }, [location.search]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch("https://podcast-api.netlify.app");
        const data = await res.json();
        setShows(data);
      } catch (err) {
        setError("Failed to load shows.");
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const results = shows.filter((show) => {
      const matchesSearch = show.title.toLowerCase().includes(lower);
      const matchesGenre =
        !selectedGenre || show.genres.includes(Number(selectedGenre));
      return matchesSearch && matchesGenre;
    });
    setFilteredShows(results);
  }, [shows, searchTerm, selectedGenre]);

  const updateURL = (search, genre) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    navigate({ pathname: "/", search: params.toString() });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    updateURL(term, selectedGenre);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    updateURL(searchTerm, genre);
  };

  const handleShowClick = (id) => {
    navigate(`/show/${id}${location.search}`);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading podcasts...</p>
    );
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Podcast Browser</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Genres</option>
          {Object.entries(genreMap).map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {filteredShows.length === 0 ? (
        <p className="text-center text-gray-500">
          No shows match your filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredShows.map((show) => (
            <div
              key={show.id}
              onClick={() => handleShowClick(show.id)}
              className="cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-[1.02] duration-200"
            >
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{show.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {show.description.slice(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((gid) => (
                    <span
                      key={gid}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {genreMap[gid]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
