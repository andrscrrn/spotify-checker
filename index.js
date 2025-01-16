import { promises as fs } from "fs";
import path from "path";
import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get music directory from command line arguments
const musicDir = process.argv[2];

if (!musicDir) {
  console.error("Please provide the music directory path as an argument.");
  console.error("Usage: node index.js /path/to/music/directory");
  process.exit(1);
}

// Verify the directory exists
try {
  const stats = await fs.stat(musicDir);
  if (!stats.isDirectory()) {
    console.error("The provided path is not a directory.");
    process.exit(1);
  }
} catch (error) {
  console.error("The provided directory does not exist.");
  process.exit(1);
}

// Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // If one string is an exact substring of the other, check length ratio
  if (s1.includes(s2) || s2.includes(s1)) {
    const ratio =
      Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    return ratio;
  }

  return 0;
}

// Check if an artist exists on Spotify
async function checkArtistOnSpotify(artistName) {
  try {
    // Search for the artist on Spotify
    const searchResult = await spotifyApi.searchArtists(artistName);

    if (searchResult.body.artists.items.length > 0) {
      // Get top 5 results and find the best match
      const potentialMatches = searchResult.body.artists.items.slice(0, 5);
      let bestMatch = null;
      let highestSimilarity = 0;

      for (const artist of potentialMatches) {
        const similarity = calculateSimilarity(artist.name, artistName);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = artist;
        }
      }

      // Only consider it a match if similarity is above 0.8 (80%)
      if (bestMatch && highestSimilarity >= 0.8) {
        return {
          exists: true,
          url: bestMatch.external_urls.spotify,
          name: bestMatch.name,
          similarity: highestSimilarity,
        };
      }
    }

    return { exists: false, url: null, name: null, similarity: 0 };
  } catch (error) {
    console.error(
      `Error searching Spotify for artist ${artistName}:`,
      error.message
    );
    return { exists: false, url: null, name: null, similarity: 0 };
  }
}

// Main function that runs the script
async function main() {
  try {
    // First, get Spotify access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);

    // Get all first-level directories
    console.log("Scanning music directory for artists...");
    const items = await fs.readdir(musicDir, { withFileTypes: true });
    const artistDirs = items.filter((item) => item.isDirectory());

    // Create log files streams
    const matchesFile = await fs.open("spotify_matches.txt", "w");
    const noMatchesFile = await fs.open("no_matches.txt", "w");

    // Process each artist directory
    for (const dir of artistDirs) {
      const artistName = dir.name;
      console.log(`Checking artist: ${artistName}`);

      const { exists, url, name, similarity } = await checkArtistOnSpotify(
        artistName
      );

      if (exists) {
        await matchesFile.write(
          `${path.join(musicDir, artistName)}\t${name}\t${url}\t${(
            similarity * 100
          ).toFixed(1)}%\n`
        );
      } else {
        await noMatchesFile.write(`${path.join(musicDir, artistName)}\n`);
      }
    }

    // Close file streams
    await matchesFile.close();
    await noMatchesFile.close();

    console.log("Processing complete!");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Run the script
(async () => {
  await main();
})();
