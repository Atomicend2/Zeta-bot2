import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const AUTH_DIR = path.join(__dirname, "../../..", "data", "auth");

export function exportSession(): string {
  const files: Record<string, string> = {};
  if (!fs.existsSync(AUTH_DIR)) return "";

  for (const name of fs.readdirSync(AUTH_DIR)) {
    const filePath = path.join(AUTH_DIR, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      files[name] = fs.readFileSync(filePath).toString("base64");
    }
  }

  if (Object.keys(files).length === 0) return "";
  return Buffer.from(JSON.stringify(files)).toString("base64");
}

export function restoreSession(sessionData: string): boolean {
  try {
    const decoded = Buffer.from(sessionData, "base64").toString("utf8");
    const files: Record<string, string> = JSON.parse(decoded);

    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    for (const [name, b64] of Object.entries(files)) {
      const filePath = path.join(AUTH_DIR, name);
      fs.writeFileSync(filePath, Buffer.from(b64, "base64"));
    }

    logger.info({ files: Object.keys(files).length }, "Session restored from SESSION_DATA env var");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to restore session from SESSION_DATA");
    return false;
  }
}

export function hasValidSession(): boolean {
  const credsPath = path.join(AUTH_DIR, "creds.json");
  if (!fs.existsSync(credsPath)) return false;
  try {
    const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
    return !!creds?.me?.id;
  } catch {
    return false;
  }
}
