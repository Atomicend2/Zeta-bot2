import app from "./app.js";
import { logger } from "./lib/logger.js";
import { connectToWhatsApp } from "./bot/connection.js";
import { getDb } from "./bot/db/database.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

getDb();
logger.info("Database initialized");

app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");

  const phone = process.env["BOT_PHONE_NUMBER"];

  if (phone) {
    try {
      logger.info({ phone }, "BOT_PHONE_NUMBER found — auto-starting bot...");
      await connectToWhatsApp(phone);
    } catch (botErr) {
      logger.error({ botErr }, "Failed to auto-start bot (user can pair via /pair page)");
    }
  } else {
    logger.info("No BOT_PHONE_NUMBER set — open the /pair page to connect the bot");
  }

  startKeepAlive();
});

function startKeepAlive() {
  const selfUrl =
    process.env["RENDER_EXTERNAL_URL"] ||
    process.env["SELF_URL"] ||
    null;

  if (!selfUrl) {
    logger.info("No RENDER_EXTERNAL_URL set — keep-alive ping disabled (not needed in dev)");
    return;
  }

  const pingUrl = `${selfUrl}/api/health`;
  const INTERVAL_MS = 14 * 60 * 1000;

  setInterval(async () => {
    try {
      const res = await fetch(pingUrl);
      logger.info({ status: res.status }, "Keep-alive ping sent");
    } catch (err) {
      logger.warn({ err }, "Keep-alive ping failed");
    }
  }, INTERVAL_MS);

  logger.info({ pingUrl, intervalMinutes: 14 }, "Keep-alive ping enabled");
}
