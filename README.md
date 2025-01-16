# Spotify Music Library Checker

[![npm version](https://img.shields.io/npm/v/spotify-library-checker.svg)](https://www.npmjs.com/package/spotify-library-checker)
[![npm downloads](https://img.shields.io/npm/dm/spotify-library-checker.svg)](https://www.npmjs.com/package/spotify-library-checker)
[![License](https://img.shields.io/npm/l/spotify-library-checker.svg)](https://github.com/andrscrrn/spotify-library-checker/blob/main/LICENSE)

A Node.js utility to help you clean up your local music library by checking which artists are available on Spotify. The tool scans your local music directory, matches artist names with Spotify's database, and helps you identify which folders you can safely delete if you're transitioning to Spotify streaming.

## Features

- Scans first-level directories in your music folder (assumed to be artist names)
- Uses Spotify's API to find matching artists
- Implements smart name matching with similarity scoring
- Generates reports of matches and non-matches
- Includes a safe deletion utility with confirmation prompts

## Prerequisites

- Node.js (v16 or higher)
- A Spotify Developer account and API credentials

## Installation

You can install this tool globally using npm:

```bash
npm install -g spotify-library-checker
```

Or run it directly using npx:

```bash
npx spotify-checker
```

## Setup

1. Create a `.env` file in your current directory with your Spotify API credentials:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

   To get these credentials:

   1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   2. Create a new application
   3. Copy the Client ID and Client Secret

## Usage

### 1. Check Artists Against Spotify

Run the command with your music directory path as an argument:

```bash
spotify-checker "/path/to/your/music/directory"
```

Or if using npx:

```bash
npx spotify-checker "/path/to/your/music/directory"
```

This will:

1. Scan all artist folders in the specified directory
2. Check each artist name against Spotify's database
3. Generate two files:
   - `spotify_matches.txt`: Lists folders with matching artists on Spotify
   - `no_matches.txt`: Lists folders with no matches on Spotify

### 2. Delete Matched Folders (Optional)

If you want to delete the folders that have matches on Spotify:

```bash
spotify-checker-delete
```

Or if using npx:

```bash
npx spotify-checker-delete
```

This script will:

- Read the `spotify_matches.txt` file
- Ask for confirmation before deleting each folder
- Show the match quality (similarity percentage) for each deletion

## Output Format

### spotify_matches.txt

```
/path/to/folder    Spotify Artist Name    Spotify URL    Similarity%
```

### no_matches.txt

```
/path/to/folder
```

## Safety Features

- Similarity threshold of 80% to prevent false matches
- Confirmation prompt before each folder deletion
- Full paths in log files for transparency
- Error handling and logging
- Directory existence validation
- Directory path validation

## Contributing

Feel free to submit issues and pull requests.

## License

ISC
