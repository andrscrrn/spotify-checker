import { promises as fs } from "fs";
import path from "path";
import readline from "readline";

async function confirmDeletion(folderPath, artistName, similarity) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `Delete "${path.basename(
        folderPath
      )}" (Spotify match: ${artistName}, Similarity: ${similarity})? [y/N] `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
}

async function main() {
  try {
    // Read the matches file
    const matchesContent = await fs.readFile("spotify_matches.txt", "utf-8");
    const matches = matchesContent.trim().split("\n");

    console.log(`Found ${matches.length} folders to process.\n`);

    // Process each match
    for (const match of matches) {
      const [folderPath, artistName, , similarity] = match.split("\t");

      // Verify the folder still exists
      try {
        await fs.access(folderPath);
      } catch {
        console.log(`Skipping "${folderPath}" - folder no longer exists`);
        continue;
      }

      // Ask for confirmation before deleting
      const shouldDelete = await confirmDeletion(
        folderPath,
        artistName,
        similarity
      );

      if (shouldDelete) {
        try {
          await fs.rm(folderPath, { recursive: true, force: true });
          console.log(`✓ Deleted: ${folderPath}`);
        } catch (error) {
          console.error(`✗ Error deleting ${folderPath}:`, error.message);
        }
      } else {
        console.log(`Skipped: ${folderPath}`);
      }
    }

    console.log("\nDeletion process complete!");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        "Error: spotify_matches.txt not found. Please run the matching script first."
      );
    } else {
      console.error("An error occurred:", error.message);
    }
  }
}

// Run the script
main();
