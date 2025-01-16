import { promises as fs } from "fs";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".spotify-library-checker");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export async function getConfig() {
  try {
    const configContent = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(configContent);
  } catch (error) {
    return null;
  }
}

export async function setConfig(clientId, clientSecret) {
  try {
    // Ensure config directory exists
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    // Write config file
    await fs.writeFile(
      CONFIG_FILE,
      JSON.stringify(
        {
          clientId,
          clientSecret,
        },
        null,
        2
      )
    );

    return true;
  } catch (error) {
    console.error("Error saving configuration:", error.message);
    return false;
  }
}

export async function configExists() {
  try {
    await fs.access(CONFIG_FILE);
    return true;
  } catch {
    return false;
  }
}
