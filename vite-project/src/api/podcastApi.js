/**
 * Fetches all podcast shows from the public API.
 * @returns {Promise<Array>} - Array of show preview objects.
 */
export async function fetchAllShows() {
  const res = await fetch("https://podcast-api.netlify.app");
  if (!res.ok) throw new Error("Failed to load shows.");
  return await res.json();
}
