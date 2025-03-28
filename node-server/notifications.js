const express = require("express");
const webPush = require("web-push");
const globalState = require("./data");
const router = express.Router();
const db = require("./database.js");

// keys for webpush
const publicVapidKey =
  "BHMoOD-_Jr8g-p0-BYTAF1W2lO96LQNpsYnfapLGg3f13QLmvx-Q9jAF-_Vy2SU73GZVr1OgP14ODbeuigltCGE";
const privateVapidKey = "mmrqXoxDsNi-YsqhlFH4vRvS5_4ZEX-Qe_V9pHSgXvk";

webPush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

router.post("/subscribe", async (req, res) => {
  console.log(req.body);
  const { user, subscription } = req.body;

  if (!user?.email || !subscription?.endpoint) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const { endpoint, keys } = subscription;
  const { p256dh, auth } = keys;

  db.query(
    `
    INSERT INTO subscriptions (email, endpoint, p256dh, auth)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      endpoint = VALUES(endpoint),
      p256dh = VALUES(p256dh),
      auth = VALUES(auth)
  `,
    [user.email, endpoint, p256dh, auth],
    async (err, results) => {
      if (err) {
        console.error("Failed to save subscription:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ success: true });
    }
  );
});


async function sendPushNotification(data) {
  const payload = JSON.stringify({
    title: data.user.username,
    body: data.message,
  });

  db.query("SELECT * FROM subscriptions", async (err, results) => {
    if (err) {
      console.error(" DB error during notification dispatch:", err);
      return;
    }

    for (const row of results) {
      const { email, endpoint, p256dh, auth } = row;

      const isConnected = globalState.connectedUsers.has(email);
      if (isConnected && email != data.user.email) {
        const subscription = {
          endpoint,
          keys: { p256dh, auth },
        };

        try {
          await webPush.sendNotification(subscription, payload);
        } catch (err) {
          console.error(
            `Push failed for ${email}:`,
            err.statusCode || err.message
          );

          if (err.statusCode === 410 || err.statusCode === 404) {
            db.query(
              "DELETE FROM subscriptions WHERE email = ?",
              [email],
              (deleteErr) => {
                if (deleteErr)
                  console.error(
                    "Failed to remove subscription:",
                    deleteErr
                  );
                else console.log(`Removed subscription for ${email}`);
              }
            );
          }
        }
      }
    }
  });
}

router.post("/send-notification", async (req, res) => {
  try {
    await sendPushNotification(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send push:", err);
    res.status(500).json({ error: "Failed to send push notification" });
  }
});

// let n=0;
// setInterval(async () => {
//     console.log("Auto-triggering push notifications...");
//     n++
//     await sendPushNotification({ "message": n });
// }, 1000);

module.exports = router; // Correctly exporting the Express router
