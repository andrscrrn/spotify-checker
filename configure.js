#!/usr/bin/env node

import readline from "readline";
import { setConfig } from "./config.js";

function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nSpotify Library Checker - Configuration\n");
  console.log("Please enter your Spotify API credentials.");
  console.log(
    "You can get these from https://developer.spotify.com/dashboard\n"
  );

  try {
    const clientId = await question(rl, "Client ID: ");
    const clientSecret = await question(rl, "Client Secret: ");

    if (!clientId || !clientSecret) {
      console.error("\nError: Both Client ID and Client Secret are required.");
      process.exit(1);
    }

    const success = await setConfig(clientId, clientSecret);

    if (success) {
      console.log("\nConfiguration saved successfully!");
      console.log(
        `Configuration file created at: ~/.spotify-library-checker/config.json`
      );
    } else {
      console.error("\nFailed to save configuration.");
      process.exit(1);
    }
  } catch (error) {
    console.error("\nAn error occurred:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
