import React from "react";

/**
 * Renders a list of podcast episodes.
 *
 * @param {Object} props
 * @param {Array<Object>} props.episodes - Array of episode objects.
 * @returns {JSX.Element}
 */
const EpisodeList = ({ episodes }) => {
  if (!episodes || episodes.length === 0) {
    return <p>No episodes available.</p>;
  }

  return (
    <div className="space-y-4">
      {episodes.map((episode, index) => (
        <div key={index} className="border p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold">{episode.title}</h3>
          <p className="text-sm text-gray-600">{episode.description}</p>
          <p className="text-xs text-gray-400">Duration: {episode.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
